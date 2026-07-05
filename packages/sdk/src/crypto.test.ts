import { createPrivateKey, createPublicKey } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  decryptBuffer,
  encryptBuffer,
  generateDeviceKeyPair,
  generateTitleKey,
  unwrapTitleKey,
  wrapTitleKeyForDevice
} from "./crypto.js";

describe("crypto", () => {
  it("encrypts and decrypts buffers with authenticated data", () => {
    const key = generateTitleKey();
    const payload = encryptBuffer(Buffer.from("playkeep"), key, Buffer.from("manifest"));

    expect(decryptBuffer(payload, key, Buffer.from("manifest")).toString()).toBe("playkeep");
    expect(() => decryptBuffer(payload, key, Buffer.from("wrong"))).toThrow();
  });

  it("wraps title keys to an ephemeral device key", () => {
    const device = generateDeviceKeyPair();
    const titleKey = generateTitleKey();
    const wrapped = wrapTitleKeyForDevice(titleKey, createPublicKey(device.publicKeyPem));

    const unwrapped = unwrapTitleKey(wrapped, createPrivateKey(device.privateKeyPem));

    expect(unwrapped.equals(titleKey)).toBe(true);
  });
});

