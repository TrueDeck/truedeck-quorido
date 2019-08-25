pragma solidity ^0.5.0;

import "../IGame.sol";
import "./WithdrawerRoleMock.sol";

contract GameMock is IGame {

    WithdrawerRoleMock private _withdrawerRoleMock;

    constructor (WithdrawerRoleMock withdrawerRoleMock) public {
        _withdrawerRoleMock = withdrawerRoleMock;
    }

    function isGame() external returns (bool) {
        return true;
    }

    function onlyWithdrawerMock() external view {
        _withdrawerRoleMock.onlyWithdrawerMock();
    }

    function renounceWithdrawer() external {
        _withdrawerRoleMock.renounceWithdrawer();
    }

    // Vague implementations to supress unused variable warnings
    function deposit(IERC20 token, uint256 amount) external returns (bool) {
        keccak256(abi.encode(address(token), amount));
        return false;
    }

    function withdraw(
        IERC20 token,
        uint256 amount,
        uint256 wonIndexes,
        bytes32[] calldata clientSeed,
        bytes32[] calldata serverSeed,
        bytes calldata data,
        bytes calldata proof
    ) external returns (bool) {
        keccak256(abi.encode(address(token), amount, wonIndexes, clientSeed, serverSeed, data, proof));
        return false;
    }
}