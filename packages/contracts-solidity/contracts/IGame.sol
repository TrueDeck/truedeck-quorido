pragma solidity ^0.5.0;

import "openzeppelin-eth/contracts/token/ERC20/IERC20.sol";

/**
 * @title IGame interface
*/
interface IGame {

    function isGame() external returns (bool);

    function deposit(IERC20 token, uint256 amount) external returns (bool);

    function withdraw(
        IERC20 token,
        uint256 amount,
        uint256 wonIndexes,
        bytes32[] calldata clientSeed,
        bytes32[] calldata serverSeed,
        bytes calldata data,
        bytes calldata proof
    ) external returns (bool);

    event Proved(
        address indexed player,
        bytes proof
    );

}
