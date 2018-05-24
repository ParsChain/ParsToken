var MultiSigWallet = artifacts.require("./wallet/MultiSigWallet.sol");
var ParsToken = artifacts.require("./token/ParsToken.sol");
var ParsPresale = artifacts.require("./presale/ParsPresale.sol");

module.exports = function(deployer, network, accounts) {
	// Wallet
	deployer.deploy(MultiSigWallet,
		[accounts[0]],
		1
	).then(function(){
		// Token
		deployer.deploy(ParsToken,
			MultiSigWallet.address
		).then(function(){
			// Presale
			const startTime = latestTime() + duration.minutes(1);
			const endTime = startTime + duration.days(45);
			
			const rate = 82000000;
			const cap = 10 ** 10 * 10 ** 3;

			deployer.deploy(ParsPresale,
				startTime,
				endTime,
				
				rate,
				MultiSigWallet.address,
				ParsToken.address,
				cap
			,  {gas: 4500000}).then(function(){
				console.log("Wallet: \t\t" + MultiSigWallet.address);
				console.log("Token: \t\t\t" + ParsToken.address);
				console.log("Presale: \t\t" + ParsPresale.address);
			});
		});
	});
};

function latestTime() {
	return web3.eth.getBlock('latest').timestamp;
}

const duration = {
	seconds: function (val) { return val; },
	minutes: function (val) { return val * this.seconds(60); },
	hours: function (val) { return val * this.minutes(60); },
	days: function (val) { return val * this.hours(24); },
	weeks: function (val) { return val * this.days(7); },
	years: function (val) { return val * this.days(365); },
};