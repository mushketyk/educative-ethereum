const Ownable = artifacts.require('Ownable');

contract('Ownable', function (accounts) {

  let ownable
  const beneficiary = accounts[0]

  beforeEach(async function() {
    ownable = await Ownable.new('ticket', {from: beneficiary})
  })

  it('checks an owner account', async function () {
    expect(
      await ownable.isOwner.call({from: beneficiary})
    ).to.equal(true)

    expect(
      await ownable.isOwner.call({from: accounts[1]})
    ).to.equal(false)
  });

  it('allows to transfer ownership', async function () {
    await ownable.transferOwnership(accounts[1], {from: beneficiary})

    expect(
      await ownable.isOwner.call({from: accounts[1]})
    ).to.equal(true)
  });
});
