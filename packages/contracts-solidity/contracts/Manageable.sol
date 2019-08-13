pragma solidity ^0.5.2;

import "zos-lib/contracts/Initializable.sol";
import "./ManagerRole.sol";

/**
 * @title Manageable
 * @dev Base contract which allows children to implement manageable operations.
 */
contract Manageable is Initializable, ManagerRole {
    event Paused(address account);
    event Unpaused(address account);

    bool private _paused;

    function initialize(address owner) public initializer {
        ManagerRole.initialize(owner);
        _paused = false;
    }

    /**
     * @return true if the contract is paused, false otherwise.
     */
    function paused() public view returns (bool) {
        return _paused;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     */
    modifier whenNotPaused() {
        require(!_paused);
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     */
    modifier whenPaused() {
        require(_paused);
        _;
    }

    /**
     * @dev called by the owner to pause, triggers stopped state
     */
    function pause() public onlyManager whenNotPaused {
        _paused = true;
        emit Paused(msg.sender);
    }

    /**
     * @dev called by the owner to unpause, returns to normal state
     */
    function unpause() public onlyManager whenPaused {
        _paused = false;
        emit Unpaused(msg.sender);
    }

    uint256[50] private ______gap;
}
