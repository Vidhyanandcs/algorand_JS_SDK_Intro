## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)

## General info
This repository will help a beginner to test the basic functionalities of algorand JS SDK.
We will be using purestake API to connect to the mainnet and testnet of Algorand Blockchain.

## Technologies
Project is created with:
* Node.JS: 14.16.0
* NPM: 6.4.11
* algosdk: 1.9.1

## Setup
To run this project, clone this project to your local machine.
Install all NPM packages
Create `.env` file and add purestake API.
You can get your purestake API by registering to `https://developer.purestake.io` 

```
cd algorand_JS_SDK_Intro
npm install --save

```

Inside .env file

```
API="paste your API"

```

Run from terminal

```
npm start
```

### Create Account

To create an account uncomment `createaddress()` function in index.js file


### Address details

To check the address details on mainnet uncomment `checkbalance()` in `index.js` and the following code in `balance.js` and update `account` variable with address

```
const Mainserver = "https://mainnet-algorand.api.purestake.io/ps2";
let client=new algosdk.Algodv2(token,Mainserver,port);
```

To check the address details on testnet uncomment the following code in `checkbalance()` in `index.js` and the following code in `balance.js` and update `account` variable with address

```
const Testserver="https://testnet-algorand.api.purestake.io/ps2"; 
let client=new algosdk.Algodv2(token,Testserver,port);
```







