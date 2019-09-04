pragma solidity ^0.5.0;

import "openzeppelin-eth/contracts/drafts/SignatureBouncer.sol";

contract SignatureBouncerMock is SignatureBouncer {
    constructor() public {
        SignatureBouncer.initialize(msg.sender);
    }

    function checkValidDataHash(bytes32 hash, bytes memory signature) public view returns (bool) {
        return _isValidDataHash(hash, signature);
    }
}