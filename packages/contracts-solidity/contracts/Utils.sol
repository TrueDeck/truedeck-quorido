pragma solidity ^0.5.0;

import "openzeppelin-eth/contracts/math/SafeMath.sol";

/**
 * @title Utils
 * @dev Contract having pure utility methods.
 */
contract Utils {

    function _calculateGameHash(
        bytes32 prevhash,
        uint256 nonce,
        bytes32 clientSeed,
        bytes32 serverSeed,
        bytes data
    ) internal pure returns (bytes32 hash) {
        hash = keccak256(abi.encodePacked(clientSeed, data));
        hash = keccak256(abi.encodePacked(prevhash, nonce, hash, serverSeed));
    }

    function _bytesToBytes(
        uint256 _offset,
        uint256 _nBytes,
        bytes memory _input,
        bytes memory _output
    ) internal pure {
        assembly {
            mstore(_output , add(_input, _offset))
            mstore(add(_output, _nBytes) , add(add(_input, _offset), _nBytes))
        }
    }

    function _bytesToUint8(
        uint256 _offset,
        bytes memory _input
    ) internal pure returns (uint8 _output) {
        assembly {
            _output := mload(add(_input, _offset))
        }
    }

    function _bytesToUint256(
        uint256 _offset,
        bytes memory _input
    ) internal pure returns (uint256 _output) {
        assembly {
            _output := mload(add(_input, _offset))
        }
    }

}