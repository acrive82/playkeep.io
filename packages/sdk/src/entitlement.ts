import { getAddress, hashMessage, recoverAddress, verifyMessage } from "ethers";

export type AccessChallenge = {
  domain: "playkeep.io";
  address: string;
  gameId: string;
  tokenId: string;
  devicePublicKeyHash: string;
  nonce: string;
  issuedAt: string;
  expiresAt: string;
};

export function buildChallengeMessage(challenge: AccessChallenge): string {
  return [
    "Playkeep access request",
    `Domain: ${challenge.domain}`,
    `Address: ${getAddress(challenge.address)}`,
    `Game ID: ${challenge.gameId}`,
    `Token ID: ${challenge.tokenId}`,
    `Device key hash: ${challenge.devicePublicKeyHash}`,
    `Nonce: ${challenge.nonce}`,
    `Issued at: ${challenge.issuedAt}`,
    `Expires at: ${challenge.expiresAt}`
  ].join("\n");
}

export function verifyChallengeSignature(message: string, signature: string, expectedAddress: string): boolean {
  return getAddress(verifyMessage(message, signature)) === getAddress(expectedAddress);
}

export function recoverChallengeSigner(message: string, signature: string): string {
  return getAddress(recoverAddress(hashMessage(message), signature));
}

