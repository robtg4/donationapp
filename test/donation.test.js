//need nodejs 8 to execute this
var Donation = artifacts.require('Donation');

contract('Donation', function(accounts) {

  //creating accounts to operate with contract - testrpc addresses from 8/20/17
  //need to change these to make valid test
  const owner = '0x3fc35d57d2b299539c4fa4ac8e7add44e80b4e95';
  const alice = '0xe0c232043f1672bab898882fc31bd1d549d8f723';
  const bob = '0x2534802ae791466f3656e766daf7024312ad4161';

  //check if number of donors is working
  it("should add one donor to the donor count", async () => {
    let donation = await Donation.deployed();

    //fire a donation to see if state variable change as expected
    await donation.donate({from: bob, value: web3.toWei('10', 'ether')});
    donorCount = await donation.donorCount();

    //create expected values to test against
    const expectedDonorCount = 1;

    //asset to test
    assert.equal(donorCount.toString(), expectedDonorCount, 'donor count incorrect, check donate function');
  });

  //get total amount raised
  it("should get the total amount raised: 10 ETH", async () => {
    let donation = await Donation.deployed();

    //fire a donation to see if state variable change as expected
    amountRaised = await donation.amountRaised();

    //create expected values to test against
    const expectedAmountRaised = web3.toWei('10', 'ether');

    //asset to test
    assert.equal(amountRaised.toString(), expectedAmountRaised, 'Total amount raised is incorrect, check donate function');
  });

  //checking added donors
  it("should add one donor to the list of donors", async () => {
    let donation = await Donation.deployed();

    //fire a donation to see if state variable change as expected
    await donation.donate({from: alice, value: web3.toWei('10', 'ether')});
    const lastDonor = await donation.fetchLastDonor.call();
    const lastDonatedTotal = await donation.fetchLastTotal.call();
    donorCount = await donation.donorCount();
    amountRaised = await donation.amountRaised();

    //create expected values to test against
    const expectedDonorCount = 2;
    const expectedDonor = {amountDonated: 10, donorAddress: alice};
    const expectedAmountRaised = web3.toWei('20', 'ether');

    //asset to test (testing incremented donor count and total amount raised )
    assert.equal(donorCount.toString(), expectedDonorCount, 'donor count incorrect, check donate function');
    assert.equal(amountRaised.toString(), expectedAmountRaised, 'Total amount raised is incorrect, check donate function');
    //testing donor list information added
    assert.equal(lastDonatedTotal, expectedDonor.amountDonated, 'donor amount incorrect, check donate function');
    assert.equal(lastDonor, expectedDonor.address, 'donor address incorrect, check donate function');
  });


});
