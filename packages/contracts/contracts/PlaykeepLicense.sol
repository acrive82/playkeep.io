// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract PlaykeepLicense is ERC1155, ERC1155Supply, Ownable {
    struct Game {
        address publisher;
        string metadataUri;
        bytes32 termsHash;
        bool transferable;
        bool exists;
    }

    mapping(address => bool) public publishers;
    mapping(bytes32 => Game) private games;
    mapping(uint256 => bytes32) public tokenGameId;

    event PublisherUpdated(address indexed publisher, bool approved);
    event GameRegistered(
        bytes32 indexed gameId,
        uint256 indexed tokenId,
        address indexed publisher,
        string metadataUri,
        bytes32 termsHash,
        bool transferable
    );
    event LicenseMinted(bytes32 indexed gameId, uint256 indexed tokenId, address indexed to, uint256 amount);
    event TransferabilityUpdated(bytes32 indexed gameId, bool transferable);

    error NotPublisher();
    error UnknownGame();
    error GameAlreadyRegistered();
    error TransfersDisabled();

    constructor(string memory baseUri) ERC1155(baseUri) Ownable(msg.sender) {}

    modifier onlyApprovedPublisher() {
        if (!publishers[msg.sender] && msg.sender != owner()) revert NotPublisher();
        _;
    }

    modifier onlyGamePublisher(bytes32 gameId) {
        Game memory registeredGame = games[gameId];
        if (!registeredGame.exists) revert UnknownGame();
        if (registeredGame.publisher != msg.sender && msg.sender != owner()) revert NotPublisher();
        _;
    }

    function setPublisher(address publisher, bool approved) external onlyOwner {
        publishers[publisher] = approved;
        emit PublisherUpdated(publisher, approved);
    }

    function registerGame(
        bytes32 gameId,
        address publisher,
        string calldata metadataUri,
        bytes32 termsHash,
        bool transferable
    ) external onlyApprovedPublisher returns (uint256 tokenId) {
        if (games[gameId].exists) revert GameAlreadyRegistered();
        if (publisher == address(0)) {
            publisher = msg.sender;
        }

        tokenId = uint256(gameId);
        games[gameId] = Game({
            publisher: publisher,
            metadataUri: metadataUri,
            termsHash: termsHash,
            transferable: transferable,
            exists: true
        });
        tokenGameId[tokenId] = gameId;

        emit GameRegistered(gameId, tokenId, publisher, metadataUri, termsHash, transferable);
    }

    function mintLicense(address to, bytes32 gameId, uint256 amount, bytes calldata data)
        external
        onlyGamePublisher(gameId)
    {
        uint256 tokenId = uint256(gameId);
        _mint(to, tokenId, amount, data);
        emit LicenseMinted(gameId, tokenId, to, amount);
    }

    function setTransferable(bytes32 gameId, bool transferable) external onlyGamePublisher(gameId) {
        games[gameId].transferable = transferable;
        emit TransferabilityUpdated(gameId, transferable);
    }

    function game(bytes32 gameId) external view returns (Game memory) {
        if (!games[gameId].exists) revert UnknownGame();
        return games[gameId];
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        bytes32 gameId = tokenGameId[tokenId];
        if (!games[gameId].exists) revert UnknownGame();
        return games[gameId].metadataUri;
    }

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Supply)
    {
        if (from != address(0) && to != address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                bytes32 gameId = tokenGameId[ids[i]];
                if (!games[gameId].transferable) revert TransfersDisabled();
            }
        }
        super._update(from, to, ids, values);
    }
}
