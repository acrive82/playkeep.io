import { readFile } from "node:fs/promises";
import { fromBase64Url } from "@playkeep/sdk";

export type KeyringEntry = {
  gameId: string;
  tokenId: string;
  version: string;
  titleKey: string;
};

export type Keyring = {
  keys: KeyringEntry[];
};

export async function loadTitleKey(keyringPath: string, gameId: string, tokenId: string): Promise<Buffer> {
  const parsed = JSON.parse(await readFile(keyringPath, "utf8")) as Keyring;
  const entry = parsed.keys.find((candidate) => candidate.gameId === gameId && candidate.tokenId === tokenId);
  if (!entry) {
    throw new Error("No title key registered for requested game/token");
  }
  return fromBase64Url(entry.titleKey);
}

