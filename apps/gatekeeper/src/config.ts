export type GatekeeperConfig = {
  port: number;
  chainId: number;
  rpcUrl?: string;
  contractAddress?: string;
  keyringPath: string;
  mockOwnershipPath?: string;
  devAllowAll: boolean;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): GatekeeperConfig {
  return {
    port: Number(env.PLAYKEEP_PORT ?? 8787),
    chainId: Number(env.PLAYKEEP_CHAIN_ID ?? 31337),
    rpcUrl: env.PLAYKEEP_RPC_URL || undefined,
    contractAddress: env.PLAYKEEP_CONTRACT_ADDRESS || undefined,
    keyringPath: env.PLAYKEEP_KEYRING_PATH ?? ".playkeep/keyring.json",
    mockOwnershipPath: env.PLAYKEEP_MOCK_OWNERSHIP_PATH || ".playkeep/mock-ownership.json",
    devAllowAll: env.PLAYKEEP_DEV_ALLOW_ALL === "true"
  };
}
