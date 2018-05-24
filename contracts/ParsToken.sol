pragma solidity ^0.4.21;

import "github.com/OpenZeppelin/zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "github.com/OpenZeppelin/zeppelin-solidity/contracts/lifecycle/Pausable.sol";

import "./Freezable.sol";

/**
 * @title ParsToken
 * @dev ERC20 Pars Token
 *
 * 1e3 (1,000) base unit
 *
 * 3 decimal precision
 *
 * 100 billion
 * 100 000 000 000 * 1e3 == 1e11 * 10**8 == 1e19
 *
 * All initial Pars are assigned to the creator of this contract.
 *
 */

contract ParsToken is StandardToken, Pausable, Freezable {
    string public constant name = "Pars Token";
    string public constant symbol = "Pars";
    uint8 public constant decimals = 3;
    uint256 public constant INITIAL_SUPPLY = 1e11 * 10**uint256(decimals);

	/**
	 * @dev Modifier to make a function callable only when the target is not the contract address.
	 */
    modifier notContract(address _address) {
        require(_address != address(this));
        _;
    }

	/**
	 * @dev ParsToken constructor
	 * Runs only on initial contract creation.
	 */
    function ParsToken(address _wallet) public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[_wallet] = INITIAL_SUPPLY;
        emit Transfer(0x0, _wallet, INITIAL_SUPPLY);
    }

	/**
	 * @dev Transfer token for a specified address when not paused
	 * @param _to		The address to transfer to.
	 * @param _value	The amount to be transferred.
	 */
    function transfer(address _to, uint256 _value) notContract(_to) isNotFrozen(msg.sender) isNotFrozen(_to) public whenNotPaused returns (bool) {
        return super.transfer(_to, _value);
    }

	/**
	 * @dev Transfer tokens from one address to another when not paused
	 * @param _from			The address which you want to send the tokens from
	 * @param _to			The address which you want to transfer to
	 * @param _value		The amount to be transferred
	 */
    function transferFrom(address _from, address _to, uint256 _value) notContract(_to) isNotFrozen(_from) isNotFrozen(_to) public whenNotPaused returns (bool) {
        return super.transferFrom(_from, _to, _value);
    }

	/**
	 * 
	 */
    function approve(address _spender, uint256 _value) public whenNotPaused returns (bool) {
        return super.approve(_spender, _value);
    }

	/**
	 * 
	 */
    function increaseApproval(address _spender, uint _addedValue) public whenNotPaused returns (bool) {
        return super.increaseApproval(_spender, _addedValue);
    }

	/**
	 * 
	 */
    function decreaseApproval(address _spender, uint _subtractedValue) public whenNotPaused returns (bool) {
        return super.decreaseApproval(_spender, _subtractedValue);
    }

	/**
	 * 
	 */
    function freeze(address _address) public whenNotPaused {
        return super.freeze(_address);
    }

	/**
	 * 
	 */
    function unfreeze(address _address) public whenNotPaused {
        return super.unfreeze(_address);
    }
}