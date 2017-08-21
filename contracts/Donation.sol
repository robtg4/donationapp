pragma solidity ^0.4.11;

contract Donation {
  //purpose: to enable people to donate to StreetCode via Ether

  //set state variables
  address owner;  //creator of contract
  mapping (uint => Donor) public donations; //donations made total
  uint public amountRaised; //total amount raised by donors
  uint public donorCount; //total donors count

  //set structs
  struct Donor {
    uint amountDonated;
    address donorAddress;
  }

  //set constructor
  function donation() {
    owner = msg.sender;
  }

  //set events
  event donatedEvent(uint donationAmount);
  event amountInquiry(address sender);
  event cashOut(address sender);
  event donorInquiry(address sender);
  event lastDonatedTotal(uint total); //test event - last donated total
  event lastDonor(address donor); //test event - last donator

  //set modifiers
  modifier checkOwner() { require(owner == msg.sender); _ ;}
  modifier checkBalance(address _sender, uint _amount) {require(_sender.balance > _amount); _ ;}

  //set functions
  function donate() checkBalance(msg.sender, msg.value) payable {
    //donor is going to donate so we need to first transfer the amount
    donorCount += 1;
    //donate amount
    owner.transfer(msg.value);
    //change state
    amountRaised += msg.value;
    donations[donorCount] = Donor({ amountDonated: msg.value, donorAddress: msg.sender});
    donatedEvent(msg.value);
  }

  function payOut() checkOwner() payable {
    //payout the balance of the contract to the contract owner
    owner.transfer(this.balance);
    cashOut(msg.sender);
  }

  function getAmountRaised() constant returns (uint) {
    amountInquiry(msg.sender);
    return amountRaised;
  }

  function getDonorCount() constant returns (uint) {
    donorInquiry(msg.sender);
    return donorCount;
  }

  /* We have this function completed so we can run tests, just ignore it :) */
  function fetchLastDonor() returns (address donorAddress) {
    donorAddress = donations[donorCount].donorAddress;
    lastDonor(donorAddress);
    return (donorAddress);
  }

  /* We have this function completed so we can run tests, just ignore it :) */
  function fetchLastTotal() returns (uint amountDonated) {
    amountDonated = donations[donorCount].amountDonated;
    lastDonatedTotal(amountDonated);
    return (amountDonated);
  }

  function kill() {
    revert();
  }

  function() {
    revert();
  }

  //set exception function
}
