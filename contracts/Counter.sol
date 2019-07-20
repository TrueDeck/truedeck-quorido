pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";

contract Counter is Initializable {
  uint public count;
  address public owner;

  function initialize(uint num) public initializer {
    owner = msg.sender;
    count = num;
  }

  function increaseCounter(uint256 amount) public {
    require(amount > 0);
    count = count + amount;
  }

  function decreaseCounter(uint256 amount) public returns (bool) {
    require(amount > 0);
    require(count > amount);
    count = count - amount;
    return true;
  }
}
