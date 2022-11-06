const Ownable = artifacts.require('Ownable')
const Auction = artifacts.require('Auction')

contract('Auction', function (accounts) {
  let ownable
  let auction
  const beneficiary = accounts[0]

  beforeEach(async function () {
    ownable = await Ownable.new('ticket', { from: beneficiary })
    auction = await Auction.new(ownable.address, { from: beneficiary })
  })

  it('does not allow to start an auction', async function () {
    try {
      await auction.startAuction(10)
      expect.fail('Should revert execution')
    } catch (error) {
      expect(error.message).to.include('Auction should be the owner')
    }
  })

  it('does not allow to end an auction before the deadline', async function () {
    await ownable.transferOwnership(auction.address, { from: beneficiary })
    await auction.startAuction(10, { from: beneficiary })

    try {
      await auction.endAuction({ from: beneficiary })
      expect.fail('Should revert execution')
    } catch (error) {
      expect(error.message).to.include('Deadline has not yet passed')
    }
  })

  it('allows to finish an auction after the deadline', async function () {
    await ownable.transferOwnership(auction.address, { from: beneficiary })
    await auction.startAuction(10, { from: beneficiary })

    await advanceTime(120)
    await mineBlock()

    await auction.endAuction({ from: beneficiary })
    expect(await ownable.isOwner.call({ from: beneficiary })).to.equal(true)
  })

  it('emits an event when an auction is finished', async function () {
    await ownable.transferOwnership(auction.address, { from: beneficiary })
    await auction.startAuction(10, { from: beneficiary })

    await advanceTime(120)
    await mineBlock()

    const receipt = await auction.endAuction({ from: beneficiary })

    const contractCreatedEvent = receipt.logs[0]
    expect(contractCreatedEvent.event).to.equal('AuctionEnded')

    const eventArgs = contractCreatedEvent.args
    expect(eventArgs.ownable.toString()).to.equal(ownable.address)
  })

  it('assigns ownership to the highest bidder', async function () {
    // We need to pass numbers as strings to avoid precision errors
    const oneEth = web3.utils.toWei('1', 'ether')

    await ownable.transferOwnership(auction.address, { from: beneficiary })
    await auction.startAuction(100, { from: beneficiary })
    await auction.placeBid({
      from: accounts[1],
      value: oneEth
    });

    await advanceTime(120)
    await mineBlock()

    const balanceBefore = await web3.eth.getBalance(beneficiary)
    await auction.endAuction({ from: accounts[2] })
    const balanceAfter = await web3.eth.getBalance(beneficiary)
    const diff = balanceAfter - balanceBefore;

    expect(diff.toString()).to.equal(oneEth)
    expect(await ownable.isOwner.call({ from: accounts[1] })).to.equal(true)
  })

  it('assigns ownership to the highest bidder', async function () {
    // Initialize auction
    await ownable.transferOwnership(auction.address, { from: beneficiary })
    await auction.startAuction(100, { from: beneficiary })

    // Make a bid from account[1]
    await auction.placeBid({
      from: accounts[1],
      value: web3.utils.toWei('1', 'ether')
    });
    // Make a bid from account[2] with a higher bid
    await auction.placeBid({
      from: accounts[2],
      value: web3.utils.toWei('2', 'ether')
    });

    // Finish the auction
    await advanceTime(120)
    await mineBlock()
    await auction.endAuction({ from: accounts[2] })

    // Check that the ownership is assigned to account[2]
    expect(await ownable.isOwner.call({ from: accounts[2] })).to.equal(true)

    const balanceBefore = await web3.eth.getBalance(accounts[1])
    // Withdraw bid for account[1]
    await auction.withdrawBid({from: accounts[1] })
    const balanceAfter = await web3.eth.getBalance(accounts[1])

    // Check that account[1] received a transfer
    expect(balanceAfter > balanceBefore).to.equal(true)
  })

  async function advanceTime(advanceBySec) {
    return new Promise((resolve, reject) => {
      web3.currentProvider.send(
        {
          jsonrpc: '2.0',
          method: 'evm_increaseTime',
          params: [advanceBySec],
        },
        (error, result) => {
          if (error) {
            return reject(err)
          }

          return resolve(result)
        }
      )
    })
  }
  async function mineBlock() {
    return new Promise((resolve, reject) => {
      web3.currentProvider.send(
        {
          jsonrpc: '2.0',
          method: 'evm_mine',
        },
        (error, result) => {
          if (error) {
            return reject(err)
          }

          return resolve(result)
        }
      )
    })
  }
})
