const Utils = artifacts.require("UtilsMock");

module.exports = function(deployer) {
  deployer.deploy(Utils);
};
