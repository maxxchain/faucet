const config = require('./config/index').env
const { sendPOAToRecipient } = require("./helpers/blockchain-helper")
const { debug } = require("./helpers/debug.js")
const { generateErrorResponse } = require("./helpers/generate-response")

module.exports.init = async function (request) {
    const isDebug = config.debug
    const receiver = request.body.receiver
    debug(isDebug, "REQUEST:")
    debug(isDebug, request.body)
    // const recaptureResponse = request.body["g-recaptcha-response"]
    // if (!recaptureResponse) {
    //     const error = {
    //         message: messages.INVALID_CAPTCHA,
    //     }
    //     return generateErrorResponse(error)
    // }

    // let captchaResponse
    // try {
    // 	captchaResponse = await validateCaptcha(recaptureResponse)
    // } catch(e) {
    // 	return generateErrorResponse(e)
    // }

    // if (await validateCaptchaResponse(captchaResponse, receiver, response)) {
    // 	await sendPOAToRecipient(web3, receiver, response, isDebug)
    // }
    return sendPOAToRecipient(receiver, isDebug);
}

module.exports.health = async function () {
    let balanceInWei
    let balanceInEth
    const address = process.env.ACCOUNT
    try {
        balanceInWei = await web3.eth.getBalance(address)
        balanceInEth = await web3.utils.fromWei(balanceInWei, "ether")
        return {
            address,
            balanceInWei: balanceInWei,
            balanceInEth: Math.round(balanceInEth)
        }
    } catch (error) {
        return generateErrorResponse(error)
    }
}