#!/usr/bin/env node
import { Command } from "commander";
import { sealCommand } from "./publisher.js";
import { installCommand } from "./player.js";

const program = new Command();

program.name("playkeep").description("Playkeep publisher and player tooling").version("0.1.0");

const publisher = program.command("publisher").description("Publisher tools");
publisher
  .command("seal")
  .description("Encrypt a game build and emit a Playkeep manifest")
  .requiredOption("--input <path>", "File or directory to package")
  .requiredOption("--out <path>", "Output directory")
  .requiredOption("--game-id <id>", "Stable game id, for example com.publisher.game")
  .requiredOption("--title <title>", "Human-readable title")
  .requiredOption("--version <version>", "Build version")
  .requiredOption("--platform <platform>", "Platform label, for example pc-windows")
  .option("--publisher <address>", "Publisher wallet address")
  .option("--uri <uri>", "Published encrypted package URI, for example ipfs://...")
  .option("--keyring <path>", "Gatekeeper keyring path")
  .action(sealCommand);

const player = program.command("player").description("Player tools");
player
  .command("install")
  .description("Request access, decrypt, verify, and extract a package")
  .requiredOption("--manifest <path>", "Playkeep manifest JSON")
  .requiredOption("--package <path>", "Encrypted package file")
  .requiredOption("--gatekeeper <url>", "Gatekeeper base URL")
  .requiredOption("--wallet-private-key <key>", "Wallet private key for the license owner")
  .requiredOption("--out <path>", "Install output directory")
  .action(installCommand);

await program.parseAsync();

