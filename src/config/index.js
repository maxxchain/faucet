
const messages = {
    INVALID_CAPTCHA: 'Invalid captcha',
    INVALID_ADDRESS: 'Invalid address',
    TX_HAS_BEEN_MINED_WITH_FALSE_STATUS: 'Transaction has been mined, but status is false',
    TX_HAS_BEEN_MINED: 'Tx has been mined',
}

const env = {
    "environment": "prod",
    "debug": true,
    "milliEtherToTransfer": 100,
    "chainId": 1023,
    "gas": 210000,
    "gasPrice": 1000000000,
    "rpc": "https://rpc.maxxchain.org"
}


module.exports = { messages, env }