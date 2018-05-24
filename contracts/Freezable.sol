pragma solidity ^0.4.21;

import "github.com/OpenZeppelin/zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
* @title Freezable
* @dev Base contract which allows addresses to be frozen.
*/
contract Freezable is Ownable {
    /**
    * @dev Generate public events that will notify clients
    */
    event Freeze();
    event Unfreeze();

    /**
    * @dev
    */
    mapping (address => bool) public frozenAccounts;

    /**
    * @dev Modifier to make a function callable only when the contract is not frozen.
    */
    modifier isNotFrozen(address _address) {
        require(!frozenAccounts[_address]);
        _;
    }

    /**
    * @dev Modifier to make a function callable only when the contract is frozen.
    */
    modifier isFrozen(address _address) {
        require(frozenAccounts[_address]);
        _;
    }

    /**
    * @dev called by the owner to pause, triggers stopped state
    */
    function freeze(address _address) isNotFrozen(_address) public onlyOwner {
        frozenAccounts[_address] = true;
        emit Freeze();
    }

    /**
    * @dev called by the owner to unpause, returns to normal state
    */
    function unfreeze(address _address) isFrozen(_address) public onlyOwner {
        frozenAccounts[_address] = false;
        emit Unfreeze();
    }

    /**
    * @dev called by the owner to pause, triggers stopped state
    */
    function frozen(address _address) public view onlyOwner returns (bool) {
        return frozenAccounts[_address];
    }
}