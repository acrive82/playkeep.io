import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { id } from "ethers";
import {
  encryptBuffer,
  generateTitleKey,
  sha256,
  toBase64Url,
  type PlaykeepManifest
} from "@playkeep/sdk";
import { archiveInput, ensureDir, readJson, writeJson } from "./files.js";

type SealOptions = {
  input: string;
  out: string;
  gameId: string;
  title: string;
  version: string;
  platform: string;
  publisher?: string;
  uri?: string;
  keyring?: string;
};

type Keyring = {
  keys: Array<{
    gameId: string;
    tokenId: string;
    version: string;
    titleKey: string;
  }>;
};

export async function sealCommand(options: SealOptions): Promise<void> {
  await ensureDir(options.out);
  const tokenId = BigInt(id(options.gameId)).toString();
  const titleKey = generateTitleKey();
  const archived = await archiveInput(options.input);

  try {
    const clearPackage = await readFile(archived.path);
    const encrypted = encryptBuffer(clearPackage, titleKey, Buffer.from(`${options.gameId}:${options.version}`));
    const encryptedBytes = Buffer.from(encrypted.ciphertext, "base64url");
    const encryptedPackagePath = join(options.out, `${options.gameId}-${options.version}.pkg.enc`);
    await writeFile(encryptedPackagePath, encryptedBytes);

    const manifest: PlaykeepManifest = {
      schema: "playkeep.manifest.v1",
      gameId: options.gameId,
      tokenId,
      title: options.title,
      version: options.version,
      platform: options.platform,
      package: {
        uri: options.uri ?? `file://${encryptedPackagePath}`,
        encryptedSha256: sha256(encryptedBytes),
        clearSha256: sha256(clearPackage),
        size: clearPackage.byteLength,
        encryptedSize: encryptedBytes.byteLength,
        encryption: {
          alg: "A256GCM",
          iv: encrypted.iv,
          tag: encrypted.tag
        }
      },
      publisher: {
        address: options.publisher
      },
      cache: {
        gateways: []
      },
      createdAt: new Date().toISOString()
    };

    const manifestPath = join(options.out, `${options.gameId}-${options.version}.manifest.json`);
    await writeJson(manifestPath, manifest);

    const keyringPath = options.keyring ?? join(options.out, "keyring.json");
    let keyring: Keyring = { keys: [] };
    try {
      keyring = await readJson<Keyring>(keyringPath);
    } catch {
      keyring = { keys: [] };
    }
    keyring.keys = keyring.keys.filter((entry) => !(entry.gameId === options.gameId && entry.tokenId === tokenId));
    keyring.keys.push({
      gameId: options.gameId,
      tokenId,
      version: options.version,
      titleKey: toBase64Url(titleKey)
    });
    await writeJson(keyringPath, keyring);

    console.log(`Encrypted package: ${encryptedPackagePath}`);
    console.log(`Manifest: ${manifestPath}`);
    console.log(`Gatekeeper keyring: ${keyringPath}`);
    console.log(`Token ID: ${tokenId}`);
  } finally {
    await archived.cleanup();
  }
}

