// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.6.0
pragma solidity ^0.8.27;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {ERC1155Pausable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract KavToken is ERC1155, Ownable, ERC1155Pausable, ERC1155Burnable, ERC1155Supply {
    // Track token creator/owner
    mapping(uint256 => address) public tokenCreator;
    
    // Track if a specific token is paused
    mapping(uint256 => bool) public pausedTokens;

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    // Allows a user to mint tokens with a specific ID.
    function mint(address account, uint256 id, uint256 amount, bytes memory data) public {
        require(amount > 0, "KavToken: Amount must be greater than 0");
        require(account != address(0), "KavToken: Cannot mint to zero address");

        // If token was never created, set the caller as the creator
        if (tokenCreator[id] == address(0)) {
            tokenCreator[id] = msg.sender;
        } else {
            // Only the token creator can mint this token
            require(msg.sender == tokenCreator[id], "KavToken: Only token creator can mint");
        }

        require(!pausedTokens[id], "KavToken: Token is paused");

        _mint(account, id, amount, data);
    }

    // @dev Allows a user to mint multiple tokens in batch.
     
    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
    {
        require(ids.length == amounts.length, "KavToken: Arrays must have the same length");
        require(to != address(0), "KavToken: Cannot mint to zero address");

        for (uint256 i = 0; i < ids.length; i++) {
            require(amounts[i] > 0, "KavToken: Amount must be greater than 0");

            // If token was never created, set the caller as the creator
            if (tokenCreator[ids[i]] == address(0)) {
                tokenCreator[ids[i]] = msg.sender;
            } else {
                // Only the token creator can mint this token
                require(msg.sender == tokenCreator[ids[i]], "KavToken: Only token creator can mint");
            }

            require(!pausedTokens[ids[i]], "KavToken: Token is paused");
        }

        _mintBatch(to, ids, amounts, data);
    }

    // Allows token creator to pause their specific token.
    function pauseToken(uint256 id) public {
        require(
            msg.sender == tokenCreator[id] || msg.sender == owner(),
            "KavToken: Only token creator or owner can pause"
        );
        pausedTokens[id] = true;
    }

    // Allows token creator to unpause their specific token.
    function unpauseToken(uint256 id) public {
        require(
            msg.sender == tokenCreator[id] || msg.sender == owner(),
            "KavToken: Only token creator or owner can unpause"
        );
        pausedTokens[id] = false;
    }

    // Allows users to burn their own tokens.
    function burn(address account, uint256 id, uint256 value) public override {
        require(account == msg.sender || msg.sender == owner(), "KavToken: Only token holder or owner can burn");
        _burn(account, id, value);
    }

    // Allows users to burn multiple tokens.

    function burnBatch(address account, uint256[] memory ids, uint256[] memory values) public override {
        require(account == msg.sender || msg.sender == owner(), "KavToken: Only token holder or owner can burn");
        _burnBatch(account, ids, values);
    }

    // Pause function for emergency - only owner
    function pauseAll() public onlyOwner {
        _pause();
    }

    // Unpause function for emergency - only owner
    function unpauseAll() public onlyOwner {
        _unpause();
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Pausable, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }
}

//contract address: 0x701C0cB3e1147E8c4581B2741071e44406e7b90b