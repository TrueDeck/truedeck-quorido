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

    function isGame() public returns (bool) {
        return true;
    }

    function deposit(IERC20 token, uint256 amount) external whenNotPaused returns (bool) {
        _state._increaseBalance(msg.sender, amount);
        return _bankroll.deposit(token, msg.sender, amount);
    }

    function withdraw(
        IERC20 token,
        uint256 amount,
        uint256 wonIndexes,
        bytes32[] calldata clientSeed,
        bytes32[] calldata serverSeed,
        bytes calldata data,
        bytes calldata proof
    ) external whenNotPaused returns (bool) {
        // State
        uint256 _balance = _state._getBalance(msg.sender);
        bytes32 _hash = _state._getHash(msg.sender);

        // Counters
        uint256 i;

        while (i < clientSeed.length) {
            bytes memory actionData = new bytes(33);
            _toBytes((clientSeed.length - i) * 33, 33, data, actionData);

            uint256 betAmount = _toUint256(33, actionData);
            _balance = _balance.sub(betAmount);

            // If won
            if (((wonIndexes >> i) & uint256(1)) == 1) {
                uint8 randomRoll = uint8(uint256(keccak256(abi.encodePacked(clientSeed[i], serverSeed[i]))) & 255) % 100 + 1;
                uint8 rollUnder = _toUint8(1, actionData);
                if (randomRoll < rollUnder) {
                    _balance = _balance.add(betAmount.mul(99).div(rollUnder-1));
                }
            }

            _hash = _calculateGameHash(_hash, clientSeed[i], serverSeed[i], actionData);

            ++i;
        }

        require(_isValidDataHash(_hash, proof));
        _state._updateHash(msg.sender, _hash);

        _balance = _balance.sub(amount);
        _state._updateBalance(msg.sender, _balance);

        _bankroll.withdraw(token, msg.sender, amount);

        emit Withdrawal(msg.sender, proof, amount, _balance);

        return true;
    }

}