pragma solidity ^0.5.0;

import "../Utils.sol";

/**
 * @title Utils
 * @dev Contract having pure utility methods.
 */
contract UtilsMock is Utils {

    function calculateGameHash(
        bytes32 prevhash,
        uint256 nonce,
        bytes32 clientSeed,
        bytes32 serverSeed,
        bytes data
    ) external pure returns (bytes32 hash) {
        return _calculateGameHash(
            prevhash,
            nonce,
            clientSeed,
            serverSeed,
            data
        );
    }

    function bytesToBytes(
        uint256 _offset,
        uint256 _nBytes,
        bytes memory _input,
        bytes memory _output
    ) external pure {
        return _bytesToBytes(
            _offset,
            _nBytes,
            _input,
            _output
        );
    }

    function bytesToUint8(
        uint256 _offset,
        bytes memory _input
    ) external pure returns (uint8 _output) {
        return _bytesToUint8(_offset, _input);
    }

    function bytesToUint256(
        uint256 _offset,
        bytes memory _input
    ) external pure returns (uint256 _output) {
        return _bytesToUint256(_offset, _input);
    }

}