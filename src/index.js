const express = require('express')
const bodyParser = require('body-parser')
let app = express();
const router = express.Router();
const path = require('path')

require('dotenv').config()
const serverless = require("serverless-http");

require('./helpers/blockchain-helper')

app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.json({
	limit: '50mb',
}))

app.use(bodyParser.urlencoded({
	limit: '50mb',
	extended: true,
}))

require('./controllers/index')(router)

router.get('/', function (request, response) {
	response.send('MaxxChain Test Network faucet')
});

app.set('port', (process.env.PORT || 9000))

app.listen(app.get('port'), function () {
	console.log('MaxxChain Test Network faucet is running on port', app.get('port'))
})

app.use(`/.netlify/functions/index`, router);

module.exports = app;
module.exports.handler = serverless(app);
