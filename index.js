require('dotenv').config()
const createAddress = require('./address') 
const checkBalance  = require('./balance')
const optIn  = require('./optin')
const sendAsset = require('./sendAsset')
const atomicTransfer = require('./atomicTransfer')

/* Uncomment the following functions to create a new address or check balance*/

//createaddress() 
//checkbalance()
//optIn()
//sendAsset()
atomicTransfer()

