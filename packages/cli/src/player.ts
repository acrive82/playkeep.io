import { createPrivateKey } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { basename, join } from "node:path";
import * as tar from "tar";
import { Wallet } from "ethers";
import {
  decryptBuffer,
  generateDeviceKeyPair,
  parseManifest,
  sha256,
  unwrapTitleKey,
  type WrappedKey
} from "@playkeep/sdk";
import { readJson } from "./files.js";

type InstallOptions = {
  manifest: string;
  package: string;
  gatekeeper: string;
  walletPrivateKey: string;
  out: string;
};

type ChallengeResponse = {
  challenge: { nonce: string };
  message: string;
};

type AccessResponse = {
  wrappedTitleKey: WrappedKey;
};

export async function installCommand(options: InstallOptions): Promise<void> {
  const manifest = parseManifest(await readJson(options.manifest));
  const encryptedBytes = await readFile(options.package);
  if (sha256(encryptedBytes) !== manifest.package.encryptedSha256) {
    throw new Error("Encrypted package hash does not match manifest");
  }

  const wallet = new Wallet(options.walletPrivateKey);
  const device = generateDeviceKeyPair();
  const challengeResponse = await postJson<ChallengeResponse>(`${options.gatekeeper}/v1/challenge`, {
    address: wallet.address,
    gameId: manifest.gameId,
    tokenId: manifest.tokenId,
    devicePublicKeyPem: device.publicKeyPem
  });
  const signature = await wallet.signMessage(challengeResponse.message);
  const accessResponse = await postJson<AccessResponse>(`${options.gatekeeper}/v1/access`, {
    address: wallet.address,
    gameId: manifest.gameId,
    tokenId: manifest.tokenId,
    devicePublicKeyPem: device.publicKeyPem,
    nonce: challengeResponse.challenge.nonce,
    signature
  });

  const titleKey = unwrapTitleKey(accessResponse.wrappedTitleKey, createPrivateKey(device.privateKeyPem));
  const clearPackage = decryptBuffer(
    {
      alg: "A256GCM",
      iv: manifest.package.encryption.iv,
      ciphertext: encryptedBytes.toString("base64url"),
      tag: manifest.package.encryption.tag
    },
    titleKey,
    Buffer.from(`${manifest.gameId}:${manifest.version}`)
  );
  if (sha256(clearPackage) !== manifest.package.clearSha256) {
    throw new Error("Clear package hash does not match manifest");
  }

  await mkdir(options.out, { recursive: true });
  const packagePath = join(options.out, `${basename(manifest.gameId)}-${manifest.version}.tar`);
  await writeFile(packagePath, clearPackage);
  await tar.x({ cwd: options.out, file: packagePath });
  console.log(`Installed to: ${options.out}`);
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }
  return (await response.json()) as T;
}
