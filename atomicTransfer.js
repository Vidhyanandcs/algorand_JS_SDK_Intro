const algosdk = require('algosdk');

async function atomicTransfer(){

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
    params.flatFee = true;

    function recoverAdminAccount(){
        const passphrase = process.env.PASSPHRASE6;
        let adminAccount = algosdk.mnemonicToSecretKey(passphrase);
        return adminAccount;
    }

    function recoverBakeryAccount(){
        const passphrase = process.env.PASSPHRASE2;
        let bakeryAccount = algosdk.mnemonicToSecretKey(passphrase);
        return bakeryAccount;
    }

    function recoverBobAccount(){
        const passphrase = process.env.PASSPHRASE3;
        let bobAccount = algosdk.mnemonicToSecretKey(passphrase);
        return bobAccount;
    }

    function recoverCustomer1Account(){
        const passphrase = process.env.PASSPHRASE4;
        let customer1Account = algosdk.mnemonicToSecretKey(passphrase);
        return customer1Account;
    }

    function recoverCustomer2Account(){
        const passphrase = process.env.PASSPHRASE5;
        let customer2Account = algosdk.mnemonicToSecretKey(passphrase);
        return customer2Account;
    }

    let adminAddress = recoverAdminAccount().addr
    let backeryAddress = recoverBakeryAccount().addr
    let bobAddress = recoverBobAccount().addr
    let customer1Address = recoverCustomer1Account().addr
    let customer2Address = recoverCustomer2Account().addr

    let revocationTarget = undefined;
    let closeRemainderTo = undefined;
    const enc = new TextEncoder()
    let note= enc.encode("Sending drop atomic transfer");

    params.fee = 5000
    let transaction1 = algosdk.makeAssetTransferTxnWithSuggestedParams(bobAddress, backeryAddress, closeRemainderTo, revocationTarget,
        200, note, assetID, params);

    let transaction2 = algosdk.makeAssetTransferTxnWithSuggestedParams(backeryAddress, adminAddress, closeRemainderTo, revocationTarget,
        100, note, assetID, params);
    transaction2.fee = 0

    let transaction3 = algosdk.makeAssetTransferTxnWithSuggestedParams(adminAddress, adminAddress, closeRemainderTo, revocationTarget,
        40, note, assetID, params);
    transaction3.fee = 0

    let transaction4 = algosdk.makeAssetTransferTxnWithSuggestedParams(adminAddress, customer1Address, closeRemainderTo, revocationTarget,
        30, note, assetID, params);
    transaction4.fee = 0

    let transaction5 = algosdk.makeAssetTransferTxnWithSuggestedParams(adminAddress, customer2Address, closeRemainderTo, revocationTarget,
        30, note, assetID, params);
    transaction5.fee = 0

    let txns = [transaction1, transaction2, transaction3, transaction4, transaction5]

    let txgroup = algosdk.assignGroupID(txns);

    signedTx1 = transaction1.signTxn(recoverBobAccount().sk)
    signedTx2 = transaction2.signTxn(recoverBakeryAccount().sk)
    signedTx3 = transaction3.signTxn(recoverAdminAccount().sk)
    signedTx4 = transaction4.signTxn(recoverAdminAccount().sk)
    signedTx5 = transaction5.signTxn(recoverAdminAccount().sk)
    
    let signed = []
    signed.push( signedTx1 )
    signed.push( signedTx2 )
    signed.push( signedTx3 )
    signed.push( signedTx4 )
    signed.push( signedTx5 )

    let tx = (await client.sendRawTransaction(signed).do());

    await waitForConfirmation(client, tx.txId);
    
}

module.exports = atomicTransfer