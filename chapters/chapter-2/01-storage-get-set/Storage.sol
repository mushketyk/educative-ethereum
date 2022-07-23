// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Storage {

    uint private number;

    function setNumber(uint newNumber) public {
        number = newNumber;
    }

    function getNumbeer() public view returns(uint) {
        return number;
    }
}
