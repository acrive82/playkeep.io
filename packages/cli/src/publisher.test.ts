import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseManifest } from "@playkeep/sdk";
import { sealCommand } from "./publisher.js";
import { readJson } from "./files.js";

describe("publisher seal", () => {
  it("creates an encrypted package, manifest, and gatekeeper keyring", async () => {
    const root = join(tmpdir(), `playkeep-cli-${Date.now()}`);
    const input = join(root, "build");
    const out = join(root, "out");
    await mkdir(input, { recursive: true });
    await writeFile(join(input, "game.txt"), "hello sovereign game", "utf8");

    await sealCommand({
      input,
      out,
      gameId: "demo-game",
      title: "Demo Game",
      version: "1.0.0",
      platform: "pc-windows"
    });

    const manifest = parseManifest(await readJson(join(out, "demo-game-1.0.0.manifest.json")));
    const encryptedPackage = await readFile(join(out, "demo-game-1.0.0.pkg.enc"));
    const keyring = await readJson<{ keys: Array<{ gameId: string; tokenId: string; titleKey: string }> }>(
      join(out, "keyring.json")
    );

    expect(manifest.gameId).toBe("demo-game");
    expect(manifest.package.encryptedSize).toBe(encryptedPackage.byteLength);
    expect(keyring.keys).toHaveLength(1);
    expect(keyring.keys[0].gameId).toBe("demo-game");
    expect(keyring.keys[0].tokenId).toBe(manifest.tokenId);
    expect(keyring.keys[0].titleKey.length).toBeGreaterThan(20);
  });
});

