pragma solidity ^0.5.0;

import "../Manageable.sol";
import "./ManagerRoleMock.sol";

contract ManageableMock is Manageable, ManagerRoleMock {
    bool public drasticMeasureTaken;
    uint256 public count;

    constructor () public {
        Manageable.initialize(msg.sender);

        drasticMeasureTaken = false;
        count = 0;
    }

    function normalProcess() external whenNotPaused {
        count++;
    }

    function drasticMeasure() external whenPaused {
        drasticMeasureTaken = true;
    }
}