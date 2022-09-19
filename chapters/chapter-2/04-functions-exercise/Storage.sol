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

    // TODO: Add an increment function

    // TODO: Add a function that returns current number, and if current value is greater than the initial value
}
