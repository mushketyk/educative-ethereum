// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Storage {

    uint public number;
    uint public initialNumber;

    constructor(uint initNumber) {
        initialNumber = initNumber;
        number = initNumber;
    }

    function setNumber(uint newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }

    function currentAndDiff() public view returns(uint currentNumber, uint difference) {

        // We can assign values without using the "return" statement
        // currentNumber = number;
        // difference = number - initialNumber;
        
        // Or we can return a tuple
        return (number, number - initialNumber);
    }
}
