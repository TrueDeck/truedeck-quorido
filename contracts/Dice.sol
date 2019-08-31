pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-eth/contracts/drafts/SignatureBouncer.sol";
import "openzeppelin-eth/contracts/math/SafeMath.sol";
import "openzeppelin-eth/contracts/token/ERC20/IERC20.sol";
import "./Bankroll.sol";
import "./Game.sol";
import "./IGame.sol";
import "./Manageable.sol";
import "./Utils.sol";

contract Dice is Initializable, IGame, Manageable, Utils, SignatureBouncer {
    using SafeMath for uint256;
    using Game for Game.State;

    Bankroll private _bankroll;
    Game.State private _state;

    function initialize(address owner, address signer, Bankroll bankroll) public initializer {
        Manageable.initialize(owner);
        SignatureBouncer.initialize(signer);
        _bankroll = bankroll;
    }

    function isGame() external pure returns (bool) {
        return true;
    }

    function deposit(IERC20 token, uint256 amount) external whenNotPaused returns (bool) {
        _state._increaseBalance(msg.sender, amount);
        return _bankroll.deposit(token, msg.sender, amount);
    }

    function withdraw(
        IERC20 token,
        uint256 amount,
        bytes calldata data,
        bytes calldata proof
    ) external whenNotPaused returns (bool) {
        // State
        uint256 _balance = _state._getBalance(msg.sender);
        bytes32 _hash = _state._getHash(msg.sender);

        // Offset & Flags
        uint256 offset;
        uint8 flags;

        do {
            bytes memory clientData = new bytes(65);
            _toBytes(offset, 65, data, clientData);

            flags = _toUint8(offset+98, data);

            uint256 betAmount = _toUint256(64, clientData);
            _balance = _balance.sub(betAmount);

            bytes32 clientSeed = _toBytes32(0, clientData);
            bytes32 serverSeed = _toBytes32(offset+65, data);

            // If won
            if (((flags >> 1) & uint256(1)) == 1) {
                uint8 randomRoll = uint8(uint256(keccak256(abi.encodePacked(clientSeed, serverSeed))) & 255) % 100 + 1;
                uint8 rollUnder = _toUint8(65, clientData);
                if (randomRoll < rollUnder) {
                    _balance = _balance.add(betAmount.mul(99).div(rollUnder-1));
                }
            }

            _hash = _calculateGameHash(_hash, serverSeed, clientData);

            offset = offset + 98;
        } while ((flags & uint256(1)) == 1);

        require(_isValidDataHash(_hash, proof));
        _state._updateHash(msg.sender, _hash);

        _balance = _balance.sub(amount);
        _state._updateBalance(msg.sender, _balance);

        _bankroll.withdraw(token, msg.sender, amount);

        emit Proved(msg.sender, proof);

        return true;
    }

}