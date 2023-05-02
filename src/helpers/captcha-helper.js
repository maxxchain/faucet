const querystring = require('querystring')
const https = require('https')
const { debug } = require('../helpers/debug')
const config = require('../config/index.js').env;
require('dotenv').config()

const { messages } = require('../config/index.js')

function validateCaptcha(captchaResponse) {
	return new Promise((resolve, reject) => {
		const isDebug = config.debug
		const secret = process.env.CAPTCHA_SECRET
		const post_data_json = {
			secret,
			"response": captchaResponse
		}

		const post_data = querystring.stringify(post_data_json)

		debug(isDebug, post_data_json)
		debug(isDebug, post_data)

		const post_options = {
			host: 'www.google.com',
			port: '443',
			path: '/recaptcha/api/siteverify',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}

		debug(isDebug, post_options)

		const post_req = https.request(post_options, function (res) {
			res.setEncoding('utf8')
			let output = ''
			res.on('data', function (chunk) {
				output += chunk
			})

			res.on('end', function () {
				debug(isDebug, "##############")
				debug(isDebug, 'Output from validateCaptcha: ')
				debug(isDebug, output)
				debug(isDebug, "##############")
				if (output) {
					debug(isDebug, JSON.parse(output))
					resolve(JSON.parse(output))
				} else {
					resolve()
				}
			})
		})

		post_req.on('error', function (error) {
			debug(isDebug, error)
			reject(error)
		})
		post_req.write(post_data, 'binary', function (error) {
			if (error) debug(isDebug, error)
		})
		post_req.end()
	})
}

async function validateCaptchaResponse(captchaResponse, response) {
	if (!captchaResponse || !captchaResponse.success) {
		generateErrorResponse(response, { message: messages.INVALID_CAPTCHA })
		return false
	}

	return true
}

module.exports = { validateCaptcha, validateCaptchaResponse }