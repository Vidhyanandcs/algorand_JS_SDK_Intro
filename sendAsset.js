const algosdk = require('algosdk');

async function sendAsset(){

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

    let assetID = (22515070);

    const params = await client.getTransactionParams().do();
    params.fee = 1000;
    params.flatFee = true;

    function recoverSenderAccount(){
        const passphrase = process.env.PASSPHRASE1;
        let senderAccount = algosdk.mnemonicToSecretKey(passphrase);
        return senderAccount;
    }

    function recoverRecipientAccount(){
        const passphrase = process.env.PASSPHRASE2;
        let recipientAccount = algosdk.mnemonicToSecretKey(passphrase);
        return recipientAccount;
    }

    let senderAccount = recoverSenderAccount()
    let sender = senderAccount.addr
    let recipientRecover = recoverRecipientAccount()
    let recipient = recipientRecover.addr

    let revocationTarget = undefined;
    let closeRemainderTo = undefined;
    const enc = new TextEncoder()
    let note= enc.encode("Sending drop");

    let amount = 1000;

    let opttxn = algosdk.makeAssetTransferTxnWithSuggestedParams(sender, recipient, closeRemainderTo, revocationTarget,
        amount, note, assetID, params);

    rawSignedTxn = opttxn.signTxn(senderAccount.sk);

    let opttx = (await client.sendRawTransaction(rawSignedTxn).do());

    await waitForConfirmation(client, opttx.txId);
    
}

module.exports = sendAsset