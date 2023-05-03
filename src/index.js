const express = require('express')
const bodyParser = require('body-parser')
let app = express();
const router = express.Router();
const path = require('path');
const { init, health } = require('./controller');

require('dotenv').config()

require('./helpers/blockchain-helper')

app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.json({
    limit: '50mb',
}))

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
}))

app.get('/', function (request, response) {
    response.send('MaxxChain Test Network faucet')
});

app.post('/', async (request, response) => {
    const res = await init(request)
    return response.send(res)
});

app.get('/health', async (request, response) => {
    const res = await health(request)
    return response.send(res)
});

app.set('port', (process.env.PORT || 9000))

app.listen(app.get('port'), function () {
    console.log('MaxxChain Test Network faucet is running on port', app.get('port'))
})

