// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SkillBadgeNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    constructor() ERC721("SkillBadge", "SBADGE") {}

    // Function to mint a new badge to a user
    function awardBadge(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds += 1;
        uint256 newItemId = _tokenIds;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

    // Returns total number of badges issued
    function totalBadgesIssued() public view returns (uint256) {
        return _tokenIds;
    }

    // Function to burn a badge (revoke)
    function revokeBadge(uint256 tokenId) public onlyOwner {
        _burn(tokenId);
    }

    // Check if a user owns a specific badge
    function ownsBadge(address user, uint256 tokenId) public view returns (bool) {
        return ownerOf(tokenId) == user;
    }

    // Update token URI (metadata)
    function updateTokenURI(uint256 tokenId, string memory newTokenURI) public onlyOwner {
        _setTokenURI(tokenId, newTokenURI);
    }

    // List all badges owned by a user (inefficient on-chain, best used off-chain)
    function badgesOfOwner(address owner) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory result = new uint256[](balance);
        uint256 count = 0;
        for (uint256 i = 1; i <= _tokenIds; i++) {
            if (_exists(i) && ownerOf(i) == owner) {
                result[count] = i;
                count++;
            }
        }
        return result;
    }
}
