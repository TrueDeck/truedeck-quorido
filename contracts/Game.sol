pragma solidity ^0.5.0;

import "openzeppelin-eth/contracts/math/SafeMath.sol";

/**
 * @title Game
 * @dev Library for managing game state.
 */
library Game {
    using SafeMath for uint256;

    struct State {
        mapping (address => uint256) balance;
        mapping (address => bytes32) hash;
    }

    /**
     * @dev gets the account's balance
     */
    function _getBalance(State storage state, address account) internal returns (uint256) {
        return state.balance[account];
    }

    /**
     * @dev gets the account's hash
     */
    function _getHash(State storage state, address account) internal returns (bytes32) {
        return state.hash[account];
    }

    /**
     * @dev increase an account balance
     */
    function _increaseBalance(State storage state, address account, uint256 amount) internal {
        require(account != address(0));
        state.balance[account] = state.balance[account].add(amount);
    }

    /**
     * @dev decrease an account balance
     */
    function _decreaseBalance(State storage state, address account, uint256 amount) internal {
        require(account != address(0));
        state.balance[account] = state.balance[account].sub(amount);
    }

    /**
     * @dev updates the account's balance
     */
    function _updateBalance(State storage state, address account, uint256 amount) internal {
        require(account != address(0));
        state.balance[account] = amount;
    }

    /**
     * @dev updates the account's hash
     */
    function _updateHash(State storage state, address account, byets32 hash) internal {
        require(account != address(0));
        state.balance[account] = hash;
    }

}