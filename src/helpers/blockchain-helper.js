const Web3 = require('web3')
const config = require('../config/index.js').env;
const { messages } = require('../config');
const { generateErrorResponse } = require('./generate-response.js');
require('dotenv').config()

const configureWeb3 = function () {
	return new Promise((resolve, reject) => {
		let web3
		if (typeof web3 !== 'undefined') {
			web3 = new Web3(web3.currentProvider)
		}
		else {
			web3 = new Web3(new Web3.providers.HttpProvider(config.rpc))
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

module.exports.sendPOAToRecipient = async function (receiver, isDebug) {
	try {
		const web3 = await configureWeb3()
		const senderPrivateKey = process.env.PRIVATE_KEY
		if (!web3.utils.isAddress(receiver)) {
			return generateErrorResponse({ message: messages.INVALID_ADDRESS })
		}
		const account = await web3.eth.accounts.privateKeyToAccount(senderPrivateKey)
		const pubKey = account.address
		// get transaction count for this wallet
		const nonce = await web3.eth.getTransactionCount(pubKey)
		// convert amount to send from ether to wei
		const value = web3.utils.toWei(`${config.milliEtherToTransfer}`, "milliether")
		// convert gas limit to big number
		const gas = web3.utils.toBN(21000)
		// get and convert gas price to wei 
		// const gasPrice = web3.utils.toWei(web3.utils.toBN(1), "gwei");
		const gasPrice = await web3.eth.getGasPrice()
		// calculate cost
		const cost = gas * gasPrice
		// subtract cost from value to send
		const sendValue = value - cost

		// create object for transaction to sign
		const txObj = {
			to: receiver,
			value: sendValue,
			gas,
			gasPrice,
			nonce
		}

		const signedTx = await web3.eth.accounts.signTransaction(txObj, senderPrivateKey)

		try {
			const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
			return {
				success:
				{
					code: 200,
					title: 'Success',
					message: messages.TX_HAS_BEEN_MINED,
					txHash: receipt.transactionHash
				}
			}

		} catch (error) {
			return {
				"error": error.message
			}
		}

	} catch (error) {
		console.log(error);
		return generateErrorResponse(error)
	}
}