import { existsSync } from "node:fs";
import { loadConfig } from "./config.js";
import { buildServer } from "./server.js";
import { AllowAllOwnershipVerifier, MockOwnershipVerifier, RpcOwnershipVerifier } from "./ownership.js";

const config = loadConfig();
const ownership =
  config.rpcUrl && config.contractAddress
    ? new RpcOwnershipVerifier(config.rpcUrl, config.contractAddress)
    : config.mockOwnershipPath && existsSync(config.mockOwnershipPath)
      ? new MockOwnershipVerifier(config.mockOwnershipPath)
      : config.devAllowAll
        ? new AllowAllOwnershipVerifier()
        : undefined;

if (!ownership) {
  throw new Error(
    "No ownership verifier configured. Set PLAYKEEP_RPC_URL and PLAYKEEP_CONTRACT_ADDRESS, provide PLAYKEEP_MOCK_OWNERSHIP_PATH, or set PLAYKEEP_DEV_ALLOW_ALL=true for local demos only."
  );
}

const app = buildServer(config, ownership);
await app.listen({ port: config.port, host: "0.0.0.0" });
