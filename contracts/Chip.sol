pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-eth/contracts/token/ERC20/StandaloneERC20.sol";
import "openzeppelin-eth/contracts/token/ERC20/ERC20Burnable.sol";

/**
 * @title Standard ERC20 token, with minting and pause functionality.
 *
 */
contract Chip is Initializable, StandaloneERC20, ERC20Burnable {

    function initialize(
        string memory name, string memory symbol, uint8 decimals, uint256 initialSupply, address initialHolder,
        address[] memory minters, address[] memory pausers
    ) public initializer {
        StandaloneERC20.initialize(name, symbol, decimals, initialSupply, initialHolder, minters, pausers);
    }

}
