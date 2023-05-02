const { sendPOAToRecipient } = require("../helpers/blockchain-helper")
const { debug } = require("../helpers/debug.js")
const config = require('../config/index').env

exports.handler = async function (event, context) {
    const isDebug = config.debug
    const data = JSON.parse(event.body)
    const receiver = data.receiver
    debug(isDebug, "REQUEST:")
    debug(isDebug, data)
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
    const res = await sendPOAToRecipient(receiver, isDebug)
console.log(res);
    return {
        statusCode: 200,
        body: JSON.stringify(res)
    }
}