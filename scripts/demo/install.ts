import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { installCommand } from "../../packages/cli/src/player.js";
import { readJson } from "../../packages/cli/src/files.js";

const demoRoot = ".playkeep";
const gameId = "hello-playkeep";
const version = "1.0.0";
const gatekeeper = process.env.PLAYKEEP_GATEKEEPER_URL ?? "http://127.0.0.1:8787";
const installDir = join(demoRoot, "installed");

async function main(): Promise<void> {
  const wallet = await readJson<{ privateKey: string }>(join(demoRoot, "wallet.json"));

  await installCommand({
    manifest: join(demoRoot, "sealed", `${gameId}-${version}.manifest.json`),
    package: join(demoRoot, "sealed", `${gameId}-${version}.pkg.enc`),
    gatekeeper,
    walletPrivateKey: wallet.privateKey,
    out: installDir
  });

  const downloaded = await readFile(join(installDir, "demo-game", "hello.txt"), "utf8");
  if (downloaded !== "Hello PlayKeep.io\n") {
    throw new Error(`Unexpected installed content: ${downloaded}`);
  }

  console.log("Playkeep demo install verified");
  console.log(downloaded.trim());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
