pragma solidity ^0.5.0;

import "../ManagerRole.sol";

contract ManagerRoleMock is ManagerRole {

    constructor() public {
        ManagerRole.initialize(msg.sender);
    }

    function onlyManagerMock() public view onlyManager {

    }
}