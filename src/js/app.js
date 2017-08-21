 App = {
  web3Provider: null,

  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {

    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {

    $.getJSON('../build/contracts/Donation.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var DonationArtifact = data;
      App.contracts.Donation = TruffleContract(DonationArtifact);
      // Set the provider for our contract.
      App.contracts.Donation.setProvider(App.web3Provider);
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    //binding the ui events with the donation events
    $(document).on('click', '#donate-button', App.handleDonation);
  },

  handleDonation: function() {

    //get value that user wants to donate
    var donationAmount = document.getElementById('donation_amount').value;
    console.log("Donation Attempt Made!");
    console.log(donationAmount);

    var donationInstance;

    //get current accounts that will pay for donation (and operate contract)
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Donation.deployed().then(function(instance) {
        donationInstance = instance;

        return donationInstance.donate({from: account, value: web3.toWei(donationAmount.toString(), 'ether')});
      }).then(function(result) {
        return App.markDonated();
      }).catch(function(err) {
        console.log(err.message);
      });
});
  },

  markDonated: function(adopters, account) {
    var name = document.getElementById('firstName').value;
    var message = "<b>Thank you ";
    message = message.concat(name + " for donating!</b>");

    $("#thank_you").html(message);
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
