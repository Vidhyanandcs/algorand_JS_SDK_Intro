const algosdk = require('algosdk');

//Functiion to create an address
createaddress = () =>{
    let account = algosdk.generateAccount();
    console.log("Account Address: ", account.addr);

    let mn = algosdk.secretKeyToMnemonic(account.sk);
    console.log("Account Mnemonic: ", mn);
}


module.exports = createaddress