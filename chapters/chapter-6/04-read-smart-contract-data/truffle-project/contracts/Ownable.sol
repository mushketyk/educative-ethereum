// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Ownable {

    address public owner;
    string public itemName;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not an owner");
        _;
    }

    constructor(string memory itemName_) {
        owner = msg.sender;
        itemName = itemName_;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0x0), "Invalid owner address");

        owner = newOwner;
    }

    function isOwner() public view returns(bool) {
        return owner == msg.sender;
    }
}