// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract NameService {
    mapping(string => address) addressForName;
    // TODO: Add a mapping from "address" to "string"

    function registerNewName(string memory name, address target) public {
        addressForName[name] = target;
        // TODO: Store "name" into the reverse mapping
    }

    function getAddress(string memory name) public view returns(address) {
        return addressForName[name];
    }

    // TODO: Add a method to get a name by target address
}