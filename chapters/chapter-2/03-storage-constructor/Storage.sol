// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Storage {

    uint public number;

    constructor(uint initNumber) {
        number = initNumber;
    }

    function setNumber(uint newNumber) public {
        number = newNumber;
    }
}
