pragma solidity ^0.5.0;

import "openzeppelin-eth/contracts/math/SafeMath.sol";

/**
 * @title Utils
 * @dev Contract having pure utility methods.
 */
contract Utils {

    function _calculateGameHash(
        bytes32 _prevhash,
        bytes32 _clientSeed,
        bytes32 _serverSeed,
        bytes memory _data
    ) internal pure returns (bytes32 _hash) {
        _hash = keccak256(abi.encodePacked(_clientSeed, _data));
        _hash = keccak256(abi.encodePacked(_prevhash, _hash, _serverSeed));
    }

    function _getBoolean(
        uint256 _packedBools,
        uint256 _boolNumber
    ) internal pure returns(bool) {
        uint256 flag = (_packedBools >> _boolNumber) & uint256(1);
        return (flag == 1 ? true : false);
    }

    function _toBytes(
        uint256 _offst,
        uint256 _nBytes,
        bytes memory _input,
        bytes memory _output
    ) internal pure {
        assembly {
            mstore(_output, _nBytes)
            let p := add(_output, 0x20)
            let v := add(add(_input, _offst), 0x20)
            mstore(p, mload(v))

            if gt(_nBytes, 0x20) {
                p := add(p, 0x20)
                v := add(v, 0x20)
                mstore(p, mload(v))
            }
            if gt(_nBytes, 0x40) {
                p := add(p, 0x20)
                v := add(v, 0x20)
                mstore(p, mload(v))
            }
            for { } gt(_nBytes, 0x60) { } {
                p := add(p, 0x20)
                v := add(v, 0x20)
                mstore(p, mload(v))
                _nBytes := sub(_nBytes, 0x20)
            }
        }
    }

    function _toBytes32(
        uint _offst,
        bytes memory _input
    ) internal pure returns (bytes32 _output) {
        assembly {
            _output := mload(add(add(_input, _offst), 0x20))
        }
    }

    function _toUint8(
        uint256 _offst,
        bytes memory _input
    ) internal pure returns (uint8 _output) {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function _toUint16(
        uint256 _offst,
        bytes memory _input
    ) internal pure returns (uint16 _output) {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function _toUint32(
        uint256 _offst,
        bytes memory _input
    ) internal pure returns (uint32 _output) {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function _toUint256(
        uint256 _offst,
        bytes memory _input
    ) internal pure returns (uint256 _output) {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

}