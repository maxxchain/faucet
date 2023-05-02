const Web3 = require('web3')
const config = require('../config/index.js').env;
const { messages } = require('../config');
const EthereumTx = require('ethereumjs-tx');
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
	const web3 = await configureWeb3()
	const senderPrivateKey = process.env.PRIVATE_KEY
	const chainId = config.chainId
	const privateKeyHex = Buffer.from(senderPrivateKey, 'hex')
	if (!web3.utils.isAddress(receiver)) {
		return generateErrorResponse({ message: messages.INVALID_ADDRESS })
	}
	const gasPrice = config.gasPrice
	const gas = config.gas
	const nonce = await web3.eth.getTransactionCount(process.env.ACCOUNT)
	const BN = web3.utils.BN
	const ethToSend = web3.utils.toWei(new BN(config.milliEtherToTransfer), "milliether")
	const rawTx = {
		chainId,
		nonce: nonce,
		gasPrice,
		gas,
		to: receiver,
		value: ethToSend,
		data: '0x00'
	}

	const tx = new EthereumTx(rawTx)
	tx.sign(privateKeyHex)

	const serializedTx = tx.serialize()

	let txHash
	web3.eth.sendSignedTransaction("0x" + serializedTx.toString('hex'))
		.on('transactionHash', (_txHash) => {
			txHash = _txHash
		})
		.on('receipt', (receipt) => {
			debug(isDebug, receipt)
			if (receipt.status == '0x1') {
				return sendRawTransactionResponse(txHash)
			} else {
				const error = {
					message: messages.TX_HAS_BEEN_MINED_WITH_FALSE_STATUS,
				}
				return generateErrorResponse(error);
			}
		})
		.on('error', (error) => {
			return generateErrorResponse(error)
		});
}

module.exports.sendRawTransactionResponse = function (txHash) {
	const successResponse = {
		code: 200,
		title: 'Success',
		message: messages.TX_HAS_BEEN_MINED,
		txHash: txHash
	}

	return ({
		success: successResponse
	})
}