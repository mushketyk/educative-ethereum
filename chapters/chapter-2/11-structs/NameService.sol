// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract NameService {
    struct TargetAndOwner {
        address target;
        address owner;
    }

    mapping(string => TargetAndOwner) addressForName;
    mapping(address => string) nameForAddress;

    function registerNewName(string memory name, address target) public {
        addressForName[name] = TargetAndOwner(target, msg.sender);
        nameForAddress[target] = name;
    }

    function getAddress(string memory name) public view returns(address) {
        TargetAndOwner storage targetAndOwner = addressForName[name];
        return targetAndOwner.target;
    }

    function getOwner(string memory name) public view returns(address) {
        TargetAndOwner storage targetAndOwner = addressForName[name];
        return targetAndOwner.owner; 
    }

    function getName(address target) public view returns(string memory) {
        return nameForAddress[target];
    }
}