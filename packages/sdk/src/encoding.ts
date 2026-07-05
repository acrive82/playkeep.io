export function toBase64Url(input: Buffer): string {
  return input.toString("base64url");
}

export function fromBase64Url(input: string): Buffer {
  return Buffer.from(input, "base64url");
}

export function normalizeHex32(value: string): `0x${string}` {
  if (!/^0x[0-9a-fA-F]{64}$/.test(value)) {
    throw new Error("Expected a 32-byte hex string");
  }
  return value.toLowerCase() as `0x${string}`;
}

