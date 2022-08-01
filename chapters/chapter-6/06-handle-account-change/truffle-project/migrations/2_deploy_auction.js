const Ownable = artifacts.require('./Ownable.sol')
const Auction = artifacts.require('./Auction.sol')

module.exports = async function(deployer) {
  await deployer.deploy(Ownable, 'ticket')
  const ownable = await Ownable.deployed()

  await deployer.deploy(Auction, ownable.address)
  const auction = await Auction.deployed()

  await ownable.transferOwnership(Auction.address)
  await auction.startAuction(3600)
}
