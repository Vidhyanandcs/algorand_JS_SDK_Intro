const algosdk = require('algosdk');

async function optIn(){

    const port="";
    const token={
        "x-api-key": process.env.API // fill in yours
    };

    /*Use the following code to get info from testnet */
    const Testserver="https://testnet-algorand.api.purestake.io/ps2"; 
    let client = new algosdk.Algodv2(token,Testserver,port);

    const waitForConfirmation = async function (client, txId) {
        let response = await client.status().do();
        let lastround = response["last-round"];
        while (true) {
            const pendingInfo = await client.pendingTransactionInformation(txId).do();
            if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                //Got the completed Transaction
                console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
                break;
            }
            lastround++;
            await client.statusAfterBlock(lastround).do();
        }
    };
    //Update ASA ID
    let assetID = (22515070);

    //getting parameters for transactions including round number and genesis hash
    const params = await client.getTransactionParams().do();
    //Setting up a fixed fee
    params.fee = 1000;
    params.flatFee = true;

    //Recovering the recipient address detials from passphrase
    function recoverRecipientAccount(){
        const passphrase = process.env.PASSPHRASE6;
        let recipientAccount = algosdk.mnemonicToSecretKey(passphrase);
        return recipientAccount;
    }
    //Recovering the sender address detials from passphrase
    let recipientRecover = recoverRecipientAccount()
    let recipient = recipientRecover.addr
    let sender = recipient

    //setting revocation target and closeremainder 
    let revocationTarget = undefined;
    let closeRemainderTo = undefined;
    //Encoding the text to convert to uint8array
    const enc = new TextEncoder()
    let note= enc.encode("");
    //Setting up a zero value transaction
    let amount = 0;

    //creating a transaction
    let opttxn = algosdk.makeAssetTransferTxnWithSuggestedParams(sender, recipient, closeRemainderTo, revocationTarget,
        amount, note, assetID, params);
    //Signing the transaction
    rawSignedTxn = opttxn.signTxn(recipientRecover.sk);
    
    //Propagate the transaction to blockchain
    let opttx = (await client.sendRawTransaction(rawSignedTxn).do());
    
    //Wait for confirmation
    await waitForConfirmation(client, opttx.txId);

    
}

module.exports = optIn