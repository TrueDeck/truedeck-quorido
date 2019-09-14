pragma solidity ^0.5.0;

import "../interfaces/IGame.sol";
import "../Game.sol";
import "./WithdrawerRoleMock.sol";
import "../Bankroll.sol";

contract GameMock is IGame {
    using Game for Game.State;

    WithdrawerRoleMock private _withdrawerRoleMock;

    Bankroll private _bankroll;
    Game.State private _state;

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

    function balanceOf(address player) external view returns (uint256) {
        return _state._getBalance(player);
    }

    function onlyWithdrawerMock() external view {
        _withdrawerRoleMock.onlyWithdrawerMock();
    }

    function renounceWithdrawer() external {
        _withdrawerRoleMock.renounceWithdrawer();
    }

    function deposit(IERC20 token, uint256 amount) external returns (bool) {
        _state._increaseBalance(msg.sender, amount);
        return _bankroll.deposit(token, msg.sender, amount);
    }

    function withdraw(
        IERC20 token,
        uint256 amount,
        bytes calldata data,
        bytes calldata proof
    ) external returns (bool) {
        keccak256(abi.encode(data, proof));
        emit Proved(msg.sender, keccak256(data));
        _state._decreaseBalance(msg.sender, _state._getBalance(msg.sender));
        return _bankroll.withdraw(token, msg.sender, amount);
    }
}