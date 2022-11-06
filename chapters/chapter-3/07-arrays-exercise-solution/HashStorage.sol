// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HashStorage {

    uint[] public hashes;

    function getHashes() public view returns(uint[] memory) {
        return hashes;
    }

    function addHash(uint hash) public {
        hashes.push(hash);
    }

    function checkIfExists(uint hash) public view returns(bool) {
        for (uint i = 0; i < hashes.length; i++) {
            if (hashes[i] == hash) {
                return true;
            }
        }

        return false;
    }

    function removeHash(uint hash) public {
        uint pos = 0;
        bool found = false;

        // Find a hash if it exists
        for (uint i = 0; i < hashes.length; i++) {
            if (hashes[i] == hash) {
                pos = i;
                found = true;
            }
        }

        // Remove an element from an array if it was found
        if (found) {
            // Starting from the positiong of the element to remove 
            // shift elements after it one position to the left
            for (uint i = pos; i < hashes.length - 1; i++){
                hashes[i] = hashes[i+1];
            }
            // Reduce the length of the array by one element
            hashes.pop();
        }
    }

}