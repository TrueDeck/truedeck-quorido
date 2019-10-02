const Utils = artifacts.require("UtilsMock")
const Chip = artifacts.require("Chip")
const Bankroll = artifacts.require("Bankroll")
const Dice = artifacts.require("Dice")

module.exports = function(deployer) {
  deployer.deploy(Utils)
  deployer.deploy(Chip)
  deployer.deploy(Bankroll)
  deployer.deploy(Dice)
}
