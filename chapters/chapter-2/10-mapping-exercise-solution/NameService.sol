// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract NameService {
    mapping(string => address) addressForName;
    mapping(address => string) nameForAddress;

    function registerNewName(string memory name, address target) public {
        addressForName[name] = target;
        nameForAddress[target] = name;
    }

    function getAddress(string memory name) public view returns(address) {
        return addressForName[name];
    }

    function getName(address target) public view returns(string memory) {
        return nameForAddress[target];
    }
}