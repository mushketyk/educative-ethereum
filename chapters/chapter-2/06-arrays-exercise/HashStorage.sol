// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HashStorage {

    uint[] public hashes;

    function getHashes() public view returns(uint[] memory) {
        return hashes;
    }

    function addHash(uint hash) public {
        // TODO: Implement a function to add a hash to the array of hashes
    }

    function checkIfExists(uint hash) public view returns(bool) {
        // TODO: Return "true" if hash in the array of hashes or "false" otherwise
    }

    function removeHash(uint hash) public {
        // TOOD: Remove hash if it exists
    }

}
