import { readFile, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { AddressInfo } from "node:net";
import { Wallet } from "ethers";
import { describe, expect, it } from "vitest";
import { parseManifest } from "@playkeep/sdk";
import { sealCommand } from "../../cli/src/publisher.js";
import { installCommand } from "../../cli/src/player.js";
import { readJson, writeJson } from "../../cli/src/files.js";
import { buildServer } from "../../../apps/gatekeeper/src/server.js";
import { MockOwnershipVerifier } from "../../../apps/gatekeeper/src/ownership.js";

describe("Playkeep demo e2e", () => {
  it("downloads Hello PlayKeep.io only through the signed ownership flow", async () => {
    const root = join(tmpdir(), `playkeep-e2e-${Date.now()}`);
    const gameDir = join(root, "hello-game");
    const sealedDir = join(root, "sealed");
    const installedDir = join(root, "installed");
    const keyringPath = join(root, "keyring.json");
    const ownershipPath = join(root, "mock-ownership.json");
    const gameId = "hello-playkeep";
    const version = "1.0.0";
    const wallet = Wallet.createRandom();

    await mkdir(gameDir, { recursive: true });
    await writeFile(join(gameDir, "hello.txt"), "Hello PlayKeep.io\n", "utf8");

    await sealCommand({
      input: gameDir,
      out: sealedDir,
      keyring: keyringPath,
      gameId,
      title: "Hello PlayKeep",
      version,
      platform: "pc-local-demo",
      publisher: wallet.address
    });

    const manifestPath = join(sealedDir, `${gameId}-${version}.manifest.json`);
    const manifest = parseManifest(await readJson(manifestPath));
    await writeJson(ownershipPath, {
      [`${wallet.address}:${manifest.tokenId}`]: 1
    });

    const server = buildServer(
      {
        port: 0,
        chainId: 31337,
        keyringPath,
        mockOwnershipPath: ownershipPath,
        devAllowAll: false
      },
      new MockOwnershipVerifier(ownershipPath)
    );

    await server.listen({ port: 0, host: "127.0.0.1" });
    try {
      const address = server.server.address() as AddressInfo;
      await installCommand({
        manifest: manifestPath,
        package: join(sealedDir, `${gameId}-${version}.pkg.enc`),
        gatekeeper: `http://127.0.0.1:${address.port}`,
        walletPrivateKey: wallet.privateKey,
        out: installedDir
      });
    } finally {
      await server.close();
    }

    await expect(readFile(join(installedDir, "hello-game", "hello.txt"), "utf8")).resolves.toBe("Hello PlayKeep.io\n");
  });
});

