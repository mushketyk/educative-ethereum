// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract NameService {
    mapping(string => address) addressForName;

    function registerNewName(string memory name, address target) public {
        addressForName[name] = target;
    }

    function getAddress(string memory name) public view returns(address) {
        return addressForName[name];
    }
}