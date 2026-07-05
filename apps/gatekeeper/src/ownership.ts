import { readFile } from "node:fs/promises";
import { Contract, JsonRpcProvider, getAddress } from "ethers";

const ERC1155_BALANCE_ABI = ["function balanceOf(address account, uint256 id) view returns (uint256)"];

export interface OwnershipVerifier {
  owns(address: string, tokenId: string): Promise<boolean>;
}

export class RpcOwnershipVerifier implements OwnershipVerifier {
  private contract: Contract;

  constructor(rpcUrl: string, contractAddress: string) {
    this.contract = new Contract(contractAddress, ERC1155_BALANCE_ABI, new JsonRpcProvider(rpcUrl));
  }

  async owns(address: string, tokenId: string): Promise<boolean> {
    const balance = await this.contract.balanceOf(getAddress(address), tokenId);
    return balance > 0n;
  }
}

export class MockOwnershipVerifier implements OwnershipVerifier {
  constructor(private readonly path: string) {}

  async owns(address: string, tokenId: string): Promise<boolean> {
    const data = JSON.parse(await readFile(this.path, "utf8")) as Record<string, number>;
    return (data[`${getAddress(address)}:${tokenId}`] ?? data[`${address.toLowerCase()}:${tokenId}`] ?? 0) > 0;
  }
}

export class AllowAllOwnershipVerifier implements OwnershipVerifier {
  async owns(): Promise<boolean> {
    return true;
  }
}

