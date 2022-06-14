//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Box is Ownable {
    uint256 private value;

    // Emitted when stored value changes
    event ValueChanged(uint256 value);

    // Store new value in the contract
    function store(uint256 _value) public onlyOwner {
        value = _value;
        emit ValueChanged(_value);
    }

    // Reads the latest value
    function retrieve() public view returns (uint256 _value) {
        _value = value;
    }
}
