const Web3 = require('web3')
const config = require('../../config.json.example')

module.exports.configureWeb3 = function () {
	return new Promise((resolve, reject) => {
		let web3
		if (typeof web3 !== 'undefined') {
			web3 = new Web3(web3.currentProvider)
		}
		else {
			web3 = new Web3(new Web3.providers.HttpProvider(config.Ethereum[config.environment].rpc))
		}

		if (typeof web3 !== 'undefined') {
			return resolve(web3)
		}

		reject({
			code: 500,
			title: "Error",
			message: "check RPC"
		})
	});
}
