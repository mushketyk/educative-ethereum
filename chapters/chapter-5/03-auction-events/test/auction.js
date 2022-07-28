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
