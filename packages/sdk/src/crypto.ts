import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createPublicKey,
  diffieHellman,
  generateKeyPairSync,
  hkdfSync,
  randomBytes,
  type KeyObject
} from "node:crypto";
import { fromBase64Url, toBase64Url } from "./encoding.js";

export type EncryptedPayload = {
  alg: "A256GCM";
  iv: string;
  ciphertext: string;
  tag: string;
};

export type DeviceKeyPair = {
  publicKeyPem: string;
  privateKeyPem: string;
};

export type WrappedKey = {
  alg: "X25519-HKDF-SHA256+A256GCM";
  ephemeralPublicKeyPem: string;
  iv: string;
  ciphertext: string;
  tag: string;
};

export function sha256(input: Buffer | string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function generateTitleKey(): Buffer {
  return randomBytes(32);
}

export function encryptBuffer(plaintext: Buffer, key: Buffer, aad?: Buffer): EncryptedPayload {
  if (key.byteLength !== 32) {
    throw new Error("Title key must be 32 bytes");
  }
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  if (aad) cipher.setAAD(aad);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    alg: "A256GCM",
    iv: toBase64Url(iv),
    ciphertext: toBase64Url(ciphertext),
    tag: toBase64Url(tag)
  };
}

export function decryptBuffer(payload: EncryptedPayload, key: Buffer, aad?: Buffer): Buffer {
  if (payload.alg !== "A256GCM") {
    throw new Error(`Unsupported encryption algorithm: ${payload.alg}`);
  }
  const decipher = createDecipheriv("aes-256-gcm", key, fromBase64Url(payload.iv));
  if (aad) decipher.setAAD(aad);
  decipher.setAuthTag(fromBase64Url(payload.tag));
  return Buffer.concat([decipher.update(fromBase64Url(payload.ciphertext)), decipher.final()]);
}

export function generateDeviceKeyPair(): DeviceKeyPair {
  const { publicKey, privateKey } = generateKeyPairSync("x25519");
  return {
    publicKeyPem: publicKey.export({ type: "spki", format: "pem" }).toString(),
    privateKeyPem: privateKey.export({ type: "pkcs8", format: "pem" }).toString()
  };
}

function deriveWrapKey(secret: Buffer): Buffer {
  return Buffer.from(hkdfSync("sha256", secret, Buffer.from("playkeep"), Buffer.from("title-key-wrap-v1"), 32));
}

export function wrapTitleKeyForDevice(titleKey: Buffer, recipientPublicKey: KeyObject): WrappedKey {
  if (titleKey.byteLength !== 32) {
    throw new Error("Title key must be 32 bytes");
  }
  const ephemeral = generateKeyPairSync("x25519");
  const secret = diffieHellman({ privateKey: ephemeral.privateKey, publicKey: recipientPublicKey });
  const wrapKey = deriveWrapKey(secret);
  const encrypted = encryptBuffer(titleKey, wrapKey);
  return {
    alg: "X25519-HKDF-SHA256+A256GCM",
    ephemeralPublicKeyPem: ephemeral.publicKey.export({ type: "spki", format: "pem" }).toString(),
    iv: encrypted.iv,
    ciphertext: encrypted.ciphertext,
    tag: encrypted.tag
  };
}

export function unwrapTitleKey(wrapped: WrappedKey, devicePrivateKey: KeyObject): Buffer {
  if (wrapped.alg !== "X25519-HKDF-SHA256+A256GCM") {
    throw new Error(`Unsupported wrapping algorithm: ${wrapped.alg}`);
  }
  const ephemeralPublicKey = createPublicKey(wrapped.ephemeralPublicKeyPem);
  const secret = diffieHellman({ privateKey: devicePrivateKey, publicKey: ephemeralPublicKey });
  const wrapKey = deriveWrapKey(secret);
  return decryptBuffer(
    {
      alg: "A256GCM",
      iv: wrapped.iv,
      ciphertext: wrapped.ciphertext,
      tag: wrapped.tag
    },
    wrapKey
  );
}
