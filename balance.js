const algosdk = require('algosdk');

// Function to check address details
checkbalance = () =>{

    const port="";
    const token={
        "x-api-key": process.env.API // fill in yours
    };

    /*Use the following code to get info from testnet */
    //const Testserver="https://testnet-algorand.api.purestake.io/ps2"; 
    //let client=new algosdk.Algodv2(token,Testserver,port);

    /*Use the following code to get info from mainnet */
    const Mainserver = "https://mainnet-algorand.api.purestake.io/ps2";
    let client=new algosdk.Algodv2(token,Mainserver,port);

    let account = 'TBP27SKA4ZIV74USO6OZQP7XZIIKELGZE2US6DRN7VRHVHSPR44IQG4MVY';

    ( async() => {
        let account_info = (await client.accountInformation(account).do());
        console.log("Balance of account 1: " + JSON.stringify(account_info));
    })().catch(e => {
        console.log(e);
    })
}


module.exports = checkbalance  