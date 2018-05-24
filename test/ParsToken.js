var utils = require('./utils.js')
var ParsToken = artifacts.require('./ParsToken.sol')

contract('ParsToken', (accounts) => {
  it('should have the name Pars Token', () => {
    return ParsToken.deployed().then((instance) => {
      return instance.name.call()
    })
    .then((name) => {
      assert.equal(name, 'Pars Token', "Pars Token wasn't the name")
    })
  })

  it('should have the symbol Pars', () => {
    return ParsToken.deployed().then((instance) => {
      return instance.symbol.call()
    })
    .then((symbol) => {
      assert.equal(symbol, 'Pars', "Pars wasn't the symbol")
    })
  })

  it('should have decimals set to 3', () => {
    return ParsToken.deployed().then((instance) => {
      return instance.decimals.call()
    })
    .then((decimals) => {
      assert.equal(decimals, 3, "3 wasn't the value of decimals")
    })
  })

  it('should have INITIAL_SUPPLY set to 100.000.000.000,000 Pars', () => {
    return ParsToken.deployed().then((instance) => {
      return instance.INITIAL_SUPPLY.call()
    })
    .then((supply) => {
      assert.equal(supply, 1e11 * 10**3, "100.000.000.000,000 wasn't the value of INITIAL_SUPPLY Pars")
    })
  })

  it('should set totalSupply to 100.000.000.000,000 Pars', () => {
    return ParsToken.deployed().then((instance) => {
      return instance.totalSupply.call()
    })
    .then((supply) => {
      assert.equal(supply, 1e11 * 10**3, "100.000.000.000,000 wasn't the value of totalSupply Pars")
    })
  })

  it('should put 100.000.000.000,000 Pars in the first account', () => {
    return ParsToken.deployed().then((instance) => {
      return instance.balanceOf.call(accounts[0])
    })
    .then((balance) => {
      assert.equal(balance.valueOf(), 1e11 * 10**3, '100.000.000.000,000 Pars were not assigned to the first account')
    })
  })

  it('should set owner information on contract creation when Ownable', () => {
    return ParsToken.deployed().then((instance) => {
      return instance.owner.call()
    })
    .then((owner) => {
      assert.equal(owner, accounts[0], 'Owner info not properly assigned')
    })
  })

  it('should allow transfer of ownership by owner when Ownable', () => {
    var pars

    return ParsToken.deployed().then((instance) => {
      pars = instance
      // from 0 to 1
      return pars.transferOwnership(accounts[1], { from: accounts[0] })
    })
    .then(() => {
      return pars.owner.call()
    })
    .then((owner) => {
      assert.equal(owner, accounts[1], 'Owner info not properly assigned')
      // reset ownership back to 0
      pars.transferOwnership(accounts[0], { from: accounts[1] })
    })
  })

  it('should not allow transfer of ownership by non-owner when Ownable', () => {
    var pars

    return ParsToken.deployed().then((instance) => {
      pars = instance
      return pars.transferOwnership(accounts[3], { from: accounts[2] })
    })
    .then((response) => {
      return response
    })
    .then(assert.fail)
    .catch((error) => {
      assert(
        error.message.indexOf('VM Exception while processing transaction: revert') >= 0,
        'non-owner accounts trying to transferOwnership() should throw an invalid opcode exception.'
      )
    })
  })

  it('should not be paused on contract creation when Pausable', () => {
    return ParsToken.deployed().then((instance) => {
      return instance.paused.call()
    })
    .then((paused) => {
      assert.equal(paused, false, 'Contract should not be paused when created')
    })
  })

  it('should be able to be paused and unpaused by owner when Pausable', () => {
    var pars

    return ParsToken.deployed().then((instance) => {
      pars = instance
      return pars.pause({ from: accounts[0] })
    })
    .then((response) => {
      utils.assertEvent(pars, { event: 'Pause' })
    })
    .then((result) => {
      return pars.paused.call()
    })
    .then((paused) => {
      assert.equal(paused, true, 'Contract should be paused after pause()')
    })
    .then(() => {
      return pars.unpause({ from: accounts[0] })
    })
    .then(() => {
      utils.assertEvent(pars, { event: 'Unpause' })
    })
    .then((result) => {
      return pars.paused.call()
    })
    .then((paused) => {
      assert.equal(paused, false, 'Contract should not be paused after unpause()')
    })
  })

  it('should not allow pause by non-owner when Pausable', () => {
    var pars

    return ParsToken.deployed().then((instance) => {
      pars = instance
      return pars.pause({ from: accounts[1] })
    })
    .then(assert.fail)
    .catch((error) => {
      assert(
        error.message.indexOf('VM Exception while processing transaction: revert') >= 0,
        'non-owner accounts trying to pause() should throw an invalid opcode exception.'
      )
    })
  })

  it('should not allow unpause by non-owner if paused when Pausable', () => {
    var pars

    return ParsToken.deployed().then((instance) => {
      pars = instance
      return pars.pause({ from: accounts[0] })
    })
    .then((response) => {
      utils.assertEvent(pars, { event: 'Pause' })
    })
    .then((result) => {
      return pars.unpause({ from: accounts[1] })
    })
    .then(assert.fail)
    .catch((error) => {
      assert(
        error.message.indexOf('VM Exception while processing transaction: revert') >= 0,
        'non-owner accounts trying to unpause() should throw an invalid opcode exception.'
      )
    })
    .then(() => {
      // reset
      pars.unpause({ from: accounts[0] })
    })
  })

  it('should be able to freeze and unfreeze by owner when Ownable', () => {
    var pars

    return ParsToken.deployed().then((instance) => {
      pars = instance
      return pars.freeze(accounts[1], { from: accounts[0] })
    })
    .then(() => {
      utils.assertEvent(pars, { event: 'Freeze' })
    })
    .then(() => {
      return pars.frozen.call(accounts[1], { from: accounts[0] })
    })
    .then((frozen) => {
      assert.equal(frozen, true, 'Address should be frozen after freeze()')
    })
    .then(() => {
      return pars.unfreeze(accounts[1], { from: accounts[0] })
    })
    .then(() => {
      utils.assertEvent(pars, { event: 'Freeze' })
    })
    .then(() => {
      return pars.frozen.call(accounts[1], { from: accounts[0] })
    })
    .then((frozen) => {
      assert.equal(frozen, false, 'Address should not be frozen after unfreeze()')
    })
  })

  it('should not allow transfer() when _from is frozen', () => {
    var pars
    var xferAmt = 1000

    return ParsToken.deployed().then((instance) => {
      pars = instance

      return pars.transfer(accounts[1], xferAmt, { from: accounts[0] })
    })
    .then(() => {
      utils.assertEvent(pars, { event: 'Transfer' })
    })
    .then(() => {
      return pars.freeze(accounts[1], { from: accounts[0] })
    })
    .then(() => {
      utils.assertEvent(pars, { event: 'Freeze' })
    })
    .then((result) => {
      return pars.transfer(accounts[2], xferAmt, { from: accounts[1] })
    })
    .then(assert.fail)
    .catch((error) => {
      assert(
        error.message.indexOf('VM Exception while processing transaction: revert') >= 0,
        'accounts trying to transfer() when frozen should throw an invalid opcode exception.'
      )
    })
    .then(() => {
      // reset
      pars.unfreeze(accounts[1], { from: accounts[0] })
    })
  })

  it('should not allow transfer() when _to is frozen', () => {
    var pars
    var xferAmt = 1000

    return ParsToken.deployed().then((instance) => {
      pars = instance
      return pars.freeze(accounts[1], { from: accounts[0] })
    })
    .then(() => {
      utils.assertEvent(pars, { event: 'Freeze' })
    })
    .then((result) => {
      return pars.transfer(accounts[1], xferAmt, { from: accounts[0] })
    })
    .then(assert.fail)
    .catch((error) => {
      assert(
        error.message.indexOf('VM Exception while processing transaction: revert') >= 0,
        'trying to transfer() to a frozen account should throw an invalid opcode exception.'
      )
    })
    .then(() => {
      // reset
      pars.unfreeze(accounts[1], { from: accounts[0] })
    })
  })

  it('should allow transfer() of Pars by address owner when unpaused', () => {
    var pars
    var xferAmt = 1000
    var account0StartingBalance
    var account1StartingBalance
    var account0EndingBalance
    var account1EndingBalance

    return ParsToken.deployed().then((instance) => {
      pars = instance
      return pars.balanceOf(accounts[0])
    })
    .then((balance) => {
      account0StartingBalance = balance.toNumber()
      return pars.balanceOf(accounts[1])
    })
    .then((balance) => {
      account1StartingBalance = balance.toNumber()
      return pars.transfer(accounts[1], xferAmt, { from: accounts[0] })
    })
    .then(() => {
      utils.assertEvent(pars, { event: 'Transfer' })
    })
    .then(() => {
      return pars.balanceOf(accounts[0])
    })
    .then((balance) => {
      account0EndingBalance = balance.toNumber()
    })
    .then((result) => {
      return pars.balanceOf(accounts[1])
    })
    .then((balance) => {
      account1EndingBalance = balance.toNumber()
    })
    .then(() => {
      assert.equal(account0EndingBalance, account0StartingBalance - xferAmt, 'Balance of account 0 incorrect')
      assert.equal(account1EndingBalance, account1StartingBalance + xferAmt, 'Balance of account 1 incorrect')
    })
  })

  it('should allow transferFrom(), when properly approved, when unpaused', () => {
    var pars
    var xferAmt = 1000
    var account0StartingBalance
    var account1StartingBalance
    var account0EndingBalance
    var account1EndingBalance

    return ParsToken.deployed().then((instance) => {
      pars = instance
      return pars.balanceOf(accounts[0], { from: accounts[0] })
    })
    .then((balance) => {
      account0StartingBalance = balance.toNumber()
      return pars.balanceOf(accounts[1], { from: accounts[1] })
    })
    .then((balance) => {
      account1StartingBalance = balance.toNumber()
      // account 1 first needs approval to move Grains from account 0
      return pars.approve(accounts[1], xferAmt, { from: accounts[0] })
    })
    .then(() => {
      utils.assertEvent(pars, { event: 'Approval' })
    })
    .then((balance) => {
      // with prior approval, account 1 can transfer Grains from account 0
      return pars.transferFrom(accounts[0], accounts[1], xferAmt, { from: accounts[1] })
    })
    .then((result) => {
      return pars.balanceOf(accounts[0], { from: accounts[0] })
    })
    .then((balance) => {
      account0EndingBalance = balance.toNumber()
    })
    .then((result) => {
      return pars.balanceOf(accounts[1], { from: accounts[1] })
    })
    .then((balance) => {
      account1EndingBalance = balance.toNumber()
    })
    .then(() => {
      assert.equal(account0EndingBalance, account0StartingBalance - xferAmt, 'Balance of account 0 incorrect')
      assert.equal(account1EndingBalance, account1StartingBalance + xferAmt, 'Balance of account 1 incorrect')
    })
  })

  it('should allow approve(), and allowance() when unpaused', () => {
    var pars
    var xferAmt = 1000

    return ParsToken.deployed().then((instance) => {
      pars = instance
      return pars.approve(accounts[1], xferAmt, { from: accounts[0] })
    })
    .then(() => {
      utils.assertEvent(pars, { event: 'Approval' })
    })
    .then(() => {
      return pars.allowance(accounts[0], accounts[1], { from: accounts[0] })
    })
    .then((allowance) => {
      return allowance.toNumber()
    })
    .then((allowance) => {
      assert.equal(allowance, xferAmt, 'Allowance amount is incorrect')
    })
    .then(() => {
      // reset
      pars.approve(accounts[1], 0, { from: accounts[0] })
    })
  })

  it('should not allow approve() when paused', () => {
    var pars
    var xferAmt = 1000

    return ParsToken.deployed().then((instance) => {
      pars = instance
      return pars.pause({ from: accounts[0] })
    })
    .then((response) => {
      utils.assertEvent(pars, { event: 'Pause' })
    })
    .then((result) => {
      return pars.approve(accounts[1], xferAmt, { from: accounts[0] })
    })
    .then(assert.fail)
    .catch((error) => {
      assert(
        error.message.indexOf('VM Exception while processing transaction: revert') >= 0,
        'accounts trying to approve() when paused should throw an invalid opcode exception.'
      )
    })
    .then(() => {
      // reset
      pars.unpause({ from: accounts[0] })
    })
    .then(() => {
      // reset
      pars.approve(accounts[1], 0, { from: accounts[0] })
    })
  })

  it('should not allow transfer() when paused', () => {
    var pars
    var xferAmt = 1000

    return ParsToken.deployed().then((instance) => {
      pars = instance
      return pars.pause({ from: accounts[0] })
    })
    .then((response) => {
      utils.assertEvent(pars, { event: 'Pause' })
    })
    .then((result) => {
      return pars.transfer(accounts[1], xferAmt, { from: accounts[0] })
    })
    .then(assert.fail)
    .catch((error) => {
      assert(
        error.message.indexOf('VM Exception while processing transaction: revert') >= 0,
        'accounts trying to transfer() when paused should throw an invalid opcode exception.'
      )
    })
    .then(() => {
      // reset
      pars.unpause({ from: accounts[0] })
    })
  })

  it('should not allow transferFrom() when paused', () => {
    var pars
    var xferAmt = 1000

    return ParsToken.deployed().then((instance) => {
      pars = instance
      return pars.approve(accounts[1], xferAmt, { from: accounts[0] })
    })
    .then((response) => {
      utils.assertEvent(pars, { event: 'Approval' })
    })
    .then(() => {
      return pars.pause({ from: accounts[0] })
    })
    .then((response) => {
      utils.assertEvent(pars, { event: 'Pause' })
    })
    .then(() => {
      return pars.transferFrom(accounts[0], accounts[1], xferAmt, { from: accounts[1] })
    })
    .then(assert.fail)
    .catch((error) => {
      assert(
        error.message.indexOf('VM Exception while processing transaction: revert') >= 0,
        'accounts trying to transferFrom() when paused should throw an invalid opcode exception.'
      )
    })
    .then(() => {
      // reset
      pars.unpause({ from: accounts[0] })
    })
    .then(() => {
      // reset
      pars.approve(accounts[1], 0, { from: accounts[0] })
    })
  })

  it('should not allow transfer() when _to is null', () => {
    var pars
    var xferAmt = 1000

    return ParsToken.deployed().then((instance) => {
      pars = instance
      return pars.transfer(null, xferAmt, { from: accounts[0] })
    })
    .then(assert.fail)
    .catch((error) => {
      assert(
        error.message.indexOf('VM Exception while processing transaction: revert') >= 0,
        'accounts trying to transfer() when _to is null should throw an invalid opcode exception.'
      )
    })
  })

  it('should not allow transfer() when _to is 0x0000000000000000000000000000000000000000', () => {
    var pars
    var xferAmt = 1000

    return ParsToken.deployed().then((instance) => {
      pars = instance
      return pars.transfer('0x0000000000000000000000000000000000000000', xferAmt, { from: accounts[0] })
    })
    .then(assert.fail)
    .catch((error) => {
      assert(
        error.message.indexOf('VM Exception while processing transaction: revert') >= 0,
        'accounts trying to transfer() when _to is 0x0000000000000000000000000000000000000000 should throw an invalid opcode exception.'
      )
    })
  })

  it('should not allow transfer() when _to is the contract address', () => {
      var pars
      var xferAmt = 1000

      return ParsToken.deployed().then((instance) => {
          pars = instance
          return pars.transfer(pars.address, xferAmt, { from: accounts[0] })
      })
      .then(assert.fail)
          .catch((error) => {
          assert(
              error.message.indexOf('VM Exception while processing transaction: revert') >= 0,
          'accounts trying to transfer() when _to is the contract address should throw an invalid opcode exception.'
        )
      })
  })

  it('should not allow transferFrom() when _to is null', () => {
    var pars
    var xferAmt = 1000

    return ParsToken.deployed().then((instance) => {
      pars = instance
      return pars.approve(accounts[1], xferAmt, { from: accounts[0] })
    })
    .then(() => {
      utils.assertEvent(pars, { event: 'Approval' })
    })
    .then(() => {
      return pars.transferFrom(accounts[0], null, xferAmt, { from: accounts[1] })
    })
    .then(assert.fail)
    .catch((error) => {
      assert(
        error.message.indexOf('VM Exception while processing transaction: revert') >= 0,
        'accounts trying to transferFrom() when _to is null should throw an invalid opcode exception.'
      )
    })
    .then(() => {
      // reset
      pars.approve(accounts[1], 0, { from: accounts[0] })
    })
  })

  it('should not allow transferFrom() when _to is 0x0000000000000000000000000000000000000000', () => {
    var pars
    var xferAmt = 1000

    return ParsToken.deployed().then((instance) => {
      pars = instance
      return pars.approve(accounts[1], xferAmt, { from: accounts[0] })
    })
    .then(() => {
      utils.assertEvent(pars, { event: 'Approval' })
    })
    .then(() => {
      return pars.transferFrom(accounts[0], '0x0000000000000000000000000000000000000000', xferAmt, { from: accounts[1] })
    })
    .then(assert.fail)
    .catch((error) => {
      assert(
        error.message.indexOf('VM Exception while processing transaction: revert') >= 0,
        'accounts trying to transferFrom() when _to is 0x0000000000000000000000000000000000000000 should throw an invalid opcode exception.'
      )
    })
    .then(() => {
      // reset
      pars.approve(accounts[1], 0, { from: accounts[0] })
    })
  })

  it('should not allow transferFrom() when _to is the contract address', () => {
    var pars
    var xferAmt = 1000

    return ParsToken.deployed().then((instance) => {
        pars = instance
        return pars.approve(accounts[1], xferAmt, { from: accounts[0] })
    })
    .then(() => {
        utils.assertEvent(pars, { event: 'Approval' })
    })
    .then(() => {
        return pars.transferFrom(accounts[0], pars.address, xferAmt, { from: accounts[1] })
    })
    .then(assert.fail)
        .catch((error) => {
        assert(
            error.message.indexOf('VM Exception while processing transaction: revert') >= 0,
        'accounts trying to transferFrom() when _to is the contract address should throw an invalid opcode exception.'
    )
    })
    .then(() => {
        // reset
        pars.approve(accounts[1], 0, { from: accounts[0] })
    })
  })

  it('should be able to send ETH to contract', () => {
      return ParsToken.deployed().then((instance) => {
          return instance.send(web3.toWei(1, "ether"))
      }).
      then(assert.success)
      .catch((error) => {
      assert(error.message.indexOf('VM Exception while processing transaction: revert') >= 0,
      'account cannot send ETH to this contract'
      )
      })
  })
})