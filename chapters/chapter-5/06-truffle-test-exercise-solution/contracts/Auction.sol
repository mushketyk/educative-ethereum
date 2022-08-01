// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./Ownable.sol";

error AmountTooSmall(uint totalBid, uint minRequired);

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
    mapping(address => uint) public totalBids;
    address public highestBidder;
    uint public totalBidsNum;

    event AuctionEnded(address ownable, address highestBidder);

    modifier onlyState(AuctionState expectedState) {
        require(state == expectedState, "Invalid state");
        _;
    }

    modifier beforeDeadline {
        require(block.timestamp <= deadline, "Deadline has passed");
        _;
    }

    modifier afterDeadline {
        require(block.timestamp > deadline, "Deadline has not yet passed");
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

    function placeBid() public onlyState(AuctionState.ONGOING) beforeDeadline payable {
        uint totalBid = totalBids[msg.sender] + msg.value;

        if (totalBid <= totalBids[highestBidder]) {
            revert AmountTooSmall({
                totalBid: totalBid,
                minRequired: totalBids[highestBidder]
            });
        }

        totalBidsNum += 1;
        totalBids[msg.sender] = totalBid;
        highestBidder = msg.sender;
    }

    function highestBid() public view returns(uint) {
        return totalBids[highestBidder];
    }

    function currentTime() public view returns(uint) {
        return block.timestamp;
    }

    function endAuction() public onlyState(AuctionState.ONGOING) afterDeadline {
        state = AuctionState.FINISHED;
        emit AuctionEnded(address(ownable), highestBidder);

        if (highestBidder == address(0x0)) {
            ownable.transferOwnership(beneficiary);
        } else {
            uint highestBidAmount = totalBids[highestBidder];
            totalBids[highestBidder] = 0;

            ownable.transferOwnership(highestBidder);
            payable(beneficiary).transfer(highestBidAmount);
        }
    }

    function withdrawBid() public onlyState(AuctionState.FINISHED) afterDeadline {
        uint totalContributed = totalBids[msg.sender];

        require(totalContributed > 0, "No amount to withdraw");
        totalBids[msg.sender] = 0;

        payable(msg.sender).transfer(totalContributed);
    }
}