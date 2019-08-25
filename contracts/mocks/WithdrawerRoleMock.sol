pragma solidity ^0.5.0;

import "../WithdrawerRole.sol";

contract WithdrawerRoleMock is WithdrawerRole {

    constructor() public {
        WithdrawerRole.initialize(msg.sender);
    }

    function onlyWithdrawerMock() public view onlyWithdrawer {

    }
}