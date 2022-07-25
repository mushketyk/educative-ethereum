// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract NameService {
    struct TargetAndOwner {
        address target;
        address owner;
        bool exists;
    }

    mapping(string => TargetAndOwner) addressForName;
    mapping(address => string) nameForAddress;

    function registerNewName(string memory name, address target) public {
        TargetAndOwner memory targetAndOwner = addressForName[name];
        require(!targetAndOwner.exists, "Record already exists");

        addressForName[name] = TargetAndOwner(target, msg.sender, true);
        nameForAddress[target] = name;
    }

    function removeName(string memory name) public {
        require(addressForName[name].owner == msg.sender, "Not an owner");

        TargetAndOwner memory targetAndOwner = addressForName[name];
        delete(addressForName[name]);
        delete(nameForAddress[targetAndOwner.target]);
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