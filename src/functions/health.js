const { generateErrorResponse } = require("../helpers/generate-response")
require('dotenv').config()

exports.handler = async function () {
    let balanceInWei
    let balanceInEth
    const address = process.env.ACCOUNT
    try {
        balanceInWei = await web3.eth.getBalance(address)
        balanceInEth = await web3.utils.fromWei(balanceInWei, "ether")
    } catch (error) {
        return generateErrorResponse(error)
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            address,
            balanceInWei: balanceInWei,
            balanceInEth: Math.round(balanceInEth)
        })
    }
}