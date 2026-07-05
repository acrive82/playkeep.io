# Testing

Playkeep splits tests by behavioral scope instead of by tool.

## Suites

### Unit

Fast checks for isolated protocol primitives and smart-contract behavior.

```bash
pnpm test:unit
```

Current coverage:

- `@playkeep/sdk`: crypto, key wrapping, hashing, manifest primitives.
- `@playkeep/contracts`: ERC-1155 license registration, minting, transferability rules.

### Integration

Checks where multiple local components collaborate, but without the full player-to-gatekeeper install journey.

```bash
pnpm test:integration
```

Current coverage:

- `@playkeep/gatekeeper`: HTTP challenge/access flow, signature verification, ownership denial.
- `@playkeep/cli`: publisher sealing flow, encrypted package output, manifest output, keyring output.

### E2E

Full user-flow tests across publisher, ownership, gatekeeper, player install, decryption, extraction, and content verification.

```bash
pnpm test:e2e
```

Current coverage:

- `Hello PlayKeep.io` demo game: one file is sealed, token-gated, downloaded, decrypted, extracted, and verified.

## All Tests

```bash
pnpm test
```

This runs `unit`, then `integration`, then `e2e`.

## Docker Demo

The Docker Compose demo is an executable smoke test for the same end-to-end story:

```bash
docker compose up --build --abort-on-container-exit demo-install
```

Expected success output:

```text
Playkeep demo install verified
Hello PlayKeep.io
```

## Naming Convention

- Unit tests: `*.test.ts` inside packages that expose `test:unit`.
- Integration tests: `*.test.ts` inside packages that expose `test:integration`.
- End-to-end tests: `*.e2e.test.ts` inside packages that expose `test:e2e`.

