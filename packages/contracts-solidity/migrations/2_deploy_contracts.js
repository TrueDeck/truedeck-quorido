const Counter = artifacts.require("Counter");
const Utils = artifacts.require("UtilsMock");

module.exports = function(deployer) {
  deployer.deploy(Counter);
  deployer.deploy(Utils);
};
