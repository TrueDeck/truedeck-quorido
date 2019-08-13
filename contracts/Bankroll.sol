pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-eth/contracts/math/SafeMath.sol";
import "openzeppelin-eth/contracts/token/ERC20/IERC20.sol";
import "./Manageable.sol";
import "./WithdrawerRole.sol";

contract Bankroll is Initializable, Manageable, WithdrawerRole {
    using SafeMath for uint256;

    function initialize(address owner) public initializer {
        Manageable.initialize(owner);
        WithdrawerRole.initialize(owner);
    }

    function deposit(IERC20 token, address from, uint256 amount) external whenNotPaused returns (bool) {
        return token.transferFrom(from, address(this), amount);
    }

    function withdraw(
        IERC20 token,
        address to,
        uint256 amount
    ) external onlyWithdrawer whenNotPaused returns (bool) {
        return token.transfer(to, amount);
    }

}