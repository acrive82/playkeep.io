import { createPublicKey, randomUUID } from "node:crypto";
import Fastify from "fastify";
import { z } from "zod";
import {
  buildChallengeMessage,
  sha256,
  verifyChallengeSignature,
  wrapTitleKeyForDevice,
  type AccessChallenge
} from "@playkeep/sdk";
import { loadTitleKey } from "./keyring.js";
import type { GatekeeperConfig } from "./config.js";
import type { OwnershipVerifier } from "./ownership.js";

const ChallengeRequest = z.object({
  address: z.string().min(1),
  gameId: z.string().min(1),
  tokenId: z.string().regex(/^[0-9]+$/),
  devicePublicKeyPem: z.string().min(1)
});

const AccessRequest = ChallengeRequest.extend({
  nonce: z.string().uuid(),
  signature: z.string().min(1)
});

type StoredChallenge = AccessChallenge & {
  message: string;
};

export function buildServer(config: GatekeeperConfig, ownership: OwnershipVerifier) {
  const app = Fastify({ logger: true });
  const challenges = new Map<string, StoredChallenge>();

  app.get("/health", async () => ({
    ok: true,
    service: "playkeep-gatekeeper"
  }));

  app.post("/v1/challenge", async (request, reply) => {
    const body = ChallengeRequest.parse(request.body);
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + 5 * 60_000);
    const challenge: AccessChallenge = {
      domain: "playkeep.io",
      address: body.address,
      gameId: body.gameId,
      tokenId: body.tokenId,
      devicePublicKeyHash: sha256(body.devicePublicKeyPem),
      nonce: randomUUID(),
      issuedAt: issuedAt.toISOString(),
      expiresAt: expiresAt.toISOString()
    };
    const message = buildChallengeMessage(challenge);
    challenges.set(challenge.nonce, { ...challenge, message });

    return reply.send({ challenge, message });
  });

  app.post("/v1/access", async (request, reply) => {
    const body = AccessRequest.parse(request.body);
    const stored = challenges.get(body.nonce);
    if (!stored) {
      return reply.code(401).send({ error: "Unknown or consumed challenge" });
    }
    challenges.delete(body.nonce);

    if (Date.parse(stored.expiresAt) < Date.now()) {
      return reply.code(401).send({ error: "Expired challenge" });
    }
    if (
      stored.address.toLowerCase() !== body.address.toLowerCase() ||
      stored.gameId !== body.gameId ||
      stored.tokenId !== body.tokenId ||
      stored.devicePublicKeyHash !== sha256(body.devicePublicKeyPem)
    ) {
      return reply.code(401).send({ error: "Challenge mismatch" });
    }
    if (!verifyChallengeSignature(stored.message, body.signature, body.address)) {
      return reply.code(401).send({ error: "Invalid wallet signature" });
    }
    if (!(await ownership.owns(body.address, body.tokenId))) {
      return reply.code(403).send({ error: "Wallet does not own requested license" });
    }

    const titleKey = await loadTitleKey(config.keyringPath, body.gameId, body.tokenId);
    const wrappedTitleKey = wrapTitleKeyForDevice(titleKey, createPublicKey(body.devicePublicKeyPem));

    return reply.send({
      wrappedTitleKey,
      chainId: config.chainId,
      tokenId: body.tokenId,
      cachePolicy: {
        packageBytesArePublicButEncrypted: true,
        titleKeyLeaseSeconds: 3600
      }
    });
  });

  return app;
}

