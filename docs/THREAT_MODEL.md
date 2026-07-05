# Threat Model

## What Playkeep Prevents

- Downloading useful game bytes from IPFS without authorization.
- Gatekeeper key release without a valid wallet signature.
- Gatekeeper key release without current token ownership.
- Silent package tampering, because decrypted package hashes are verified.
- Central store lock-in, because storage can be mirrored independently.

## What Playkeep Does Not Fully Prevent

- Copying after a package has been decrypted on a compromised device.
- Screen capture, memory scraping, or modified game binaries.
- Credential theft from a compromised wallet.
- Publishers shipping online-only games that later lose server support.

## Anti-Piracy Strategy

Playkeep uses layered deterrence:

- encrypted public packages;
- token-gated key release;
- short-lived signed challenges;
- optional device-bound access sessions;
- production watermarking hooks per license;
- audit logs for suspicious access patterns.

Strong anti-piracy and absolute offline sovereignty are in tension. The protocol should make that tradeoff explicit per game.

