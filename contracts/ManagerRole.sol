pragma solidity ^0.5.0;

import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/access/Roles.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/ownership/Ownable.sol";

/**
 * @title ManagerRole
 * @dev Manager accounts have been approved by the Owner to perform certain actions.
 * This role is special in that the only account that can manage this role is Owner,
 * and not Managers themselves.
 */
contract ManagerRole is Initializable, Ownable {
    using Roles for Roles.Role;

    event ManagerAdded(address indexed account);
    event ManagerRemoved(address indexed account);

    Roles.Role private _managers;

    modifier onlyManager() {
        require(isManager(msg.sender));
        _;
    }

    function initialize(address owner) public initializer {
        Ownable.initialize(owner);
    }

    function isManager(address account) public view returns (bool) {
        return _managers.has(account);
    }

    function addManager(address account) public onlyOwner {
        _addManager(account);
    }

    function removeManager(address account) public onlyOwner {
        _removeManager(account);
    }

    function renounceManager() public {
        _removeManager(msg.sender);
    }

    function _addManager(address account) internal {
        _managers.add(account);
        emit ManagerAdded(account);
    }

    function _removeManager(address account) internal {
        _managers.remove(account);
        emit ManagerRemoved(account);
    }

    uint256[50] private ______gap;
}
