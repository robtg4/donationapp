var ConvertLib = artifacts.require("./ConvertLib.sol");
var Donation = artifacts.require("./Donation.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, Donation);
  deployer.deploy(Donation);
};
