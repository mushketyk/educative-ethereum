// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "Ownable.sol";

contract Auction {
    enum AuctionState {
        INITIALIZED,
        ONGOING,
        FINISHED
    }

    address public beneficiary;
    uint public deadline;
    Ownable public ownable;
    AuctionState public state = AuctionState.INITIALIZED;

    modifier onlyState(AuctionState expectedState) {
        require(state == expectedState, "Invalid state");
        _;
    }

    constructor(address ownableAddress) {
        beneficiary = msg.sender;

        ownable = Ownable(ownableAddress);
        require(ownable.owner() == address(beneficiary), "Should be owned by the caller");
    }

    function startAuction(uint duration) public  onlyState(AuctionState.INITIALIZED)  {
        require(ownable.isOwner(), "Auction should be the owner");
        deadline = block.timestamp + duration;

        state = AuctionState.ONGOING;
    }
}