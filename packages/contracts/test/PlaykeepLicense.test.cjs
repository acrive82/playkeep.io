const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PlaykeepLicense", function () {
  async function deploy() {
    const [owner, publisher, player, secondPlayer] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("PlaykeepLicense");
    const license = await Contract.deploy("ipfs://base/");
    const gameId = ethers.id("demo-game");
    return { owner, publisher, player, secondPlayer, license, gameId };
  }

  it("registers games and mints licenses", async function () {
    const { publisher, player, license, gameId } = await deploy();

    await license.setPublisher(publisher.address, true);
    await license.connect(publisher).registerGame(gameId, publisher.address, "ipfs://manifest", ethers.id("terms"), true);
    await license.connect(publisher).mintLicense(player.address, gameId, 1, "0x");

    expect(await license.balanceOf(player.address, BigInt(gameId))).to.equal(1n);
    expect(await license.uri(BigInt(gameId))).to.equal("ipfs://manifest");
  });

  it("blocks transfers for non-transferable games", async function () {
    const { publisher, player, secondPlayer, license, gameId } = await deploy();

    await license.setPublisher(publisher.address, true);
    await license.connect(publisher).registerGame(gameId, publisher.address, "ipfs://manifest", ethers.id("terms"), false);
    await license.connect(publisher).mintLicense(player.address, gameId, 1, "0x");

    await expect(
      license.connect(player).safeTransferFrom(player.address, secondPlayer.address, BigInt(gameId), 1, "0x")
    ).to.be.revertedWithCustomError(license, "TransfersDisabled");
  });

  it("allows transfers when enabled", async function () {
    const { publisher, player, secondPlayer, license, gameId } = await deploy();

    await license.setPublisher(publisher.address, true);
    await license.connect(publisher).registerGame(gameId, publisher.address, "ipfs://manifest", ethers.id("terms"), true);
    await license.connect(publisher).mintLicense(player.address, gameId, 1, "0x");
    await license.connect(player).safeTransferFrom(player.address, secondPlayer.address, BigInt(gameId), 1, "0x");

    expect(await license.balanceOf(secondPlayer.address, BigInt(gameId))).to.equal(1n);
  });
});

