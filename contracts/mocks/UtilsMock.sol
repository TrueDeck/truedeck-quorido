pragma solidity ^0.5.0;

import "../Utils.sol";

/**
 * @title Utils
 * @dev Contract having pure utility methods.
 */
contract UtilsMock is Utils {

    function calculateGameHash(
        bytes32 prevhash,
        bytes32 clientSeed,
        bytes32 serverSeed,
        bytes calldata data
    ) external pure returns (bytes32 hash) {
        return _calculateGameHash(
            prevhash,
            clientSeed,
            serverSeed,
            data
        );
    }

    function toBool(
        uint8 _packedBools,
        uint8 _boolNumber
    ) external pure returns (bool) {
        return _toBool(_packedBools, _boolNumber);
    }

    function toUint8(
        uint256 _offst,
        bytes calldata _input
    ) external pure returns (uint8) {
        return _toUint8(_offst, _input);
    }

    function toUint16(
        uint256 _offst,
        bytes calldata _input
    ) external pure returns (uint16) {
        return _toUint16(_offst, _input);
    }

    function toUint32(
        uint256 _offst,
        bytes calldata _input
    ) external pure returns (uint32) {
        return _toUint32(_offst, _input);
    }

    function toUint256(
        uint256 _offst,
        bytes calldata _input
    ) external pure returns (uint256) {
        return _toUint256(_offst, _input);
    }

    function toBytes32(
        uint256 _offst,
        bytes calldata _input
    ) external pure returns (bytes32) {
        return _toBytes32(_offst, _input);
    }

    function toBytes(
        uint256 _offst,
        uint256 _nBytes,
        bytes calldata _input
    ) external pure returns (bytes memory _output) {
        _output = new bytes(_nBytes);
        _toBytes(
            _offst,
            _nBytes,
            _input,
            _output
        );
    }

    function deserialize(
        bytes calldata _input
    ) external pure returns (
        bytes memory _bytes1,
        uint8 _int8,
        bytes32 _b1,
        uint16 _int16,
        bytes memory _bytes2,
        uint32 _int32,
        bytes32 _b2,
        uint256 _int256
    ) {
        _bytes1 = new bytes(35);
        _toBytes(0, 35, _input, _bytes1);
        _int8 = _toUint8(1, _bytes1);
        _b1 = _toBytes32(1, _bytes1);
        _int16 = _toUint16(35, _bytes1);

        _bytes2 = new bytes(68);
        _toBytes(35, 68, _input, _bytes2);
        _int32 = _toUint32(4, _bytes2);
        _b2 = _toBytes32(4, _bytes2);
        _int256 = _toUint256(68, _bytes2);
    }

    event Profiled(bytes, uint8, uint16, uint32, uint256, bool, bytes32);

    function profile(
        bytes calldata _input
    ) external {
        bytes memory _bytes = new bytes(100);
        _toBytes(0, 100, _input, _bytes);

        uint8 _int8 = _toUint8(1, _bytes);
        uint16 _int16 = _toUint16(3, _bytes);
        uint32 _int32 = _toUint32(7, _bytes);
        uint256 _int256 = _toUint256(39, _bytes);
        bool _bool = _toBool(_int256, 255);
        bytes32 _bytes32 = _toBytes32(39, _bytes);

        emit Profiled(_bytes, _int8, _int16, _int32, _int256, _bool, _bytes32);
    }

}