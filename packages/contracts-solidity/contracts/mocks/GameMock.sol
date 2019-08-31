pragma solidity ^0.5.0;

import "../IGame.sol";
import "./WithdrawerRoleMock.sol";
import "../Bankroll.sol";

contract GameMock is IGame {

    WithdrawerRoleMock private _withdrawerRoleMock;

    Bankroll private _bankroll;

    constructor () public {

    }

    function setWithdrawerRoleMock(WithdrawerRoleMock withdrawerRoleMock) public {
        _withdrawerRoleMock = withdrawerRoleMock;
    }

    function setBankroll(Bankroll bankroll) public {
        _bankroll = bankroll;
    }

    function isGame() external pure returns (bool) {
        return true;
    }

    function onlyWithdrawerMock() external view {
        _withdrawerRoleMock.onlyWithdrawerMock();
    }

    function renounceWithdrawer() external {
        _withdrawerRoleMock.renounceWithdrawer();
    }

    function deposit(IERC20 token, uint256 amount) external returns (bool) {
        return _bankroll.deposit(token, msg.sender, amount);
    }

    function withdraw(
        IERC20 token,
        uint256 amount,
        bytes calldata data,
        bytes calldata proof
    ) external returns (bool) {
        keccak256(abi.encode(data, proof));
        emit Proved(msg.sender, proof);
        return _bankroll.withdraw(token, msg.sender, amount);
    }
}