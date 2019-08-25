pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-eth/contracts/access/Roles.sol";
import "openzeppelin-eth/contracts/ownership/Ownable.sol";
import "./IGame.sol";

/**
 * @title WithdrawerRole
 * @dev Withdrawer IGame Contracts have been approved by the Owner to perform certain actions.
 * This role is special in that:
 * - Only IGame Contracts can be added as Withdrawers.
 * - The only account that can manage this role is Owner, and not Withdrawers themselves.
 */
contract WithdrawerRole is Initializable, Ownable {
    using Roles for Roles.Role;

    event WithdrawerAdded(address indexed account);
    event WithdrawerRemoved(address indexed account);

    Roles.Role private _withdrawers;

    modifier onlyWithdrawer() {
        require(isWithdrawer(msg.sender));
        _;
    }

    modifier onlyGame(address account) {
        IGame game = IGame(account);
        require(game.isGame());
        _;
    }

    function initialize(address sender) public initializer {
        Ownable.initialize(sender);
    }

    function isWithdrawer(address account) public view returns (bool) {
        return _withdrawers.has(account);
    }

    function addWithdrawer(address account) public onlyOwner onlyGame(account) {
        _addWithdrawer(account);
    }

    function removeWithdrawer(address account) public onlyOwner {
        _removeWithdrawer(account);
    }

    function renounceWithdrawer() public {
        _removeWithdrawer(msg.sender);
    }

    function _addWithdrawer(address account) internal {
        _withdrawers.add(account);
        emit WithdrawerAdded(account);
    }

    function _removeWithdrawer(address account) internal {
        _withdrawers.remove(account);
        emit WithdrawerRemoved(account);
    }

    uint256[50] private ______gap;
}
