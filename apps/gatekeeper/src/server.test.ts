import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Wallet } from "ethers";
import { describe, expect, it } from "vitest";
import { generateDeviceKeyPair, generateTitleKey, toBase64Url } from "@playkeep/sdk";
import { buildServer } from "./server.js";
import type { OwnershipVerifier } from "./ownership.js";

class StaticOwnership implements OwnershipVerifier {
  constructor(private readonly allowed: boolean) {}
  async owns(): Promise<boolean> {
    return this.allowed;
  }
}

describe("gatekeeper server", () => {
  it("wraps a title key only after wallet signature and ownership", async () => {
    const dir = join(tmpdir(), `playkeep-${Date.now()}`);
    await mkdir(dir, { recursive: true });
    const keyringPath = join(dir, "keyring.json");
    const titleKey = generateTitleKey();
    const gameId = "demo-game";
    const tokenId = "123";
    await writeFile(
      keyringPath,
      JSON.stringify({ keys: [{ gameId, tokenId, version: "1.0.0", titleKey: toBase64Url(titleKey) }] }),
      "utf8"
    );

    const wallet = Wallet.createRandom();
    const device = generateDeviceKeyPair();
    const app = buildServer({ port: 0, chainId: 31337, keyringPath, devAllowAll: false }, new StaticOwnership(true));

    const challengeResponse = await app.inject({
      method: "POST",
      url: "/v1/challenge",
      payload: { address: wallet.address, gameId, tokenId, devicePublicKeyPem: device.publicKeyPem }
    });
    expect(challengeResponse.statusCode).toBe(200);
    const challenge = challengeResponse.json();
    const signature = await wallet.signMessage(challenge.message);

    const accessResponse = await app.inject({
      method: "POST",
      url: "/v1/access",
      payload: {
        address: wallet.address,
        gameId,
        tokenId,
        devicePublicKeyPem: device.publicKeyPem,
        nonce: challenge.challenge.nonce,
        signature
      }
    });

    expect(accessResponse.statusCode).toBe(200);
    expect(accessResponse.json().wrappedTitleKey.alg).toBe("X25519-HKDF-SHA256+A256GCM");
  });

  it("rejects wallets without ownership", async () => {
    const app = buildServer(
      { port: 0, chainId: 31337, keyringPath: "missing.json", devAllowAll: false },
      new StaticOwnership(false)
    );
    const wallet = Wallet.createRandom();
    const device = generateDeviceKeyPair();
    const challengeResponse = await app.inject({
      method: "POST",
      url: "/v1/challenge",
      payload: { address: wallet.address, gameId: "demo-game", tokenId: "123", devicePublicKeyPem: device.publicKeyPem }
    });
    const challenge = challengeResponse.json();
    const signature = await wallet.signMessage(challenge.message);

    const accessResponse = await app.inject({
      method: "POST",
      url: "/v1/access",
      payload: {
        address: wallet.address,
        gameId: "demo-game",
        tokenId: "123",
        devicePublicKeyPem: device.publicKeyPem,
        nonce: challenge.challenge.nonce,
        signature
      }
    });

    expect(accessResponse.statusCode).toBe(403);
  });
});
