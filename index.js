require('dotenv').config()
const algosdk = require('algosdk');

//Functiion to create an address
createaddress = () =>{
    let account = algosdk.generateAccount();
    console.log("Account Address: ", account.addr);

    let mn = algosdk.secretKeyToMnemonic(account.sk);
    console.log("Account Mnemonic: ", mn);
}

// Function to check balance
checkbalance = () =>{
    //const Testserver="https://testnet-algorand.api.purestake.io/ps2"; //Use for testnet
    const Mainserver = "https://mainnet-algorand.api.purestake.io/ps2"; //Use for mainnet
    const port="";
    const token={
        "x-api-key": process.env.API // fill in yours
    };

    //let client=new algosdk.Algodv2(token,Testserver,port); //Use for testnet
    let client=new algosdk.Algodv2(token,Mainserver,port);  //Use for mainnet

    let account = 'TBP27SKA4ZIV74USO6OZQP7XZIIKELGZE2US6DRN7VRHVHSPR44IQG4MVY';

    ( async() => {
        let account_info = (await client.accountInformation(account).do());
        console.log("Balance of account 1: " + JSON.stringify(account_info));
    })().catch(e => {
        console.log(e);
    })
}


// Function calls

// createaddress() //creating new address
checkbalance()  //Checking balance

