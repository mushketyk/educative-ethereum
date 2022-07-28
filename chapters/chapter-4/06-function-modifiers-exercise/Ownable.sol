// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Ownable {

    address public owner;
    string public itemName;

    // TODO: Add "onlyOwner" function modifier

    constructor(string memory itemName_) {
        owner = msg.sender;
        itemName = itemName_;
    }

    // TODO: Replace "require" with a function modifier
    function transferOwnership(address newOwner) public {
        require(isOwner(), "Not an owner");
        require(newOwner != address(0x0), "Invalid owner address");

        owner = newOwner; 
    }

    function isOwner() public view returns(bool) {
        return owner == msg.sender;
    }
}