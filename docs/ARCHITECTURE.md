# Playkeep Architecture

## Core Principle

Playkeep separates ownership, storage, and access:

- Ownership lives on-chain.
- Encrypted bytes live on IPFS, Filecoin, publisher CDNs, or community mirrors.
- Key release happens only after entitlement verification.

The public network should only ever see encrypted game packages.

## Components

### License Contract

`PlaykeepLicense` is an ERC-1155 contract. Each game maps to one token ID, derived from a `bytes32 gameId`. Publishers can register games and mint licenses. Transfers can be enabled or disabled per game.

### Manifest

The manifest describes encrypted artifacts:

- game identity and version;
- encrypted package URI or CID;
- encrypted package SHA-256;
- encryption metadata;
- publisher signature field reserved for production signing;
- cache hints.

The manifest does not include title keys.

### Publisher CLI

`playkeep publisher seal` archives a game build, generates a title key, encrypts the build with AES-256-GCM, writes a manifest, and stores the title key in a local keyring file for the gatekeeper.

### Gatekeeper

The gatekeeper:

1. issues short-lived challenges;
2. verifies wallet signatures;
3. checks token ownership through RPC or a local mock file;
4. wraps the title key to the player's ephemeral X25519 device public key;
5. returns only the wrapped title key, never clear package bytes.

### Player CLI

`playkeep player install` creates an ephemeral device key pair, signs the challenge, receives a wrapped title key, decrypts the encrypted package, and extracts it locally.

## Recommended Production Additions

- Threshold key network instead of a single gatekeeper.
- Per-license package watermarking.
- Hardware or TEE attestation where available.
- Filecoin storage deals and multiple pinning providers.
- Publisher build signing and reproducible manifest verification.
- License recovery and inheritance policy.
- Revocation rules limited to fraud or chargeback cases.

