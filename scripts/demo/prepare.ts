import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Wallet } from "ethers";
import { parseManifest } from "@playkeep/sdk";
import { sealCommand } from "../../packages/cli/src/publisher.js";
import { readJson, writeJson } from "../../packages/cli/src/files.js";

const demoRoot = ".playkeep";
const gameDir = join(demoRoot, "demo-game");
const outDir = join(demoRoot, "sealed");
const installDir = join(demoRoot, "installed");
const gameId = "hello-playkeep";
const version = "1.0.0";

async function main(): Promise<void> {
  await mkdir(gameDir, { recursive: true });
  await mkdir(installDir, { recursive: true });
  await writeFile(join(gameDir, "hello.txt"), "Hello PlayKeep.io\n", "utf8");

  const wallet = Wallet.createRandom();
  await sealCommand({
    input: gameDir,
    out: outDir,
    keyring: join(demoRoot, "keyring.json"),
    gameId,
    title: "Hello PlayKeep",
    version,
    platform: "pc-local-demo",
    publisher: wallet.address
  });

  const manifestPath = join(outDir, `${gameId}-${version}.manifest.json`);
  const manifest = parseManifest(await readJson(manifestPath));
  await writeJson(join(demoRoot, "wallet.json"), {
    address: wallet.address,
    privateKey: wallet.privateKey
  });
  await writeJson(join(demoRoot, "mock-ownership.json"), {
    [`${wallet.address}:${manifest.tokenId}`]: 1
  });

  console.log("Playkeep demo prepared");
  console.log(`Wallet: ${wallet.address}`);
  console.log(`Manifest: ${manifestPath}`);
  console.log(`Encrypted package: ${join(outDir, `${gameId}-${version}.pkg.enc`)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
