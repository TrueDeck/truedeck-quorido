pragma solidity ^0.5.0;

import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/StandaloneERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20Burnable.sol";

/**
 * @title Standard ERC20 chip, with minting, burn and pause functionality.
 *
 */
contract Chip is Initializable, StandaloneERC20, ERC20Burnable {

    function initialize(
        string memory name, string memory symbol, uint8 decimals, uint256 initialSupply, address initialHolder,
        address[] memory minters, address[] memory pausers
    ) public initializer {
        require(minters.length > 0);
        require(pausers.length > 0);
        StandaloneERC20.initialize(name, symbol, decimals, initialSupply, initialHolder, minters, pausers);
    }

}
