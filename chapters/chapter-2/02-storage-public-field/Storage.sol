// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Storage {

    uint public number;

    function setNumber(uint newNumber) public {
        number = newNumber;
    }
}
