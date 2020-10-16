# handcash-connect-sdk-integration-example
Example of how to integrate HandCash Connect SDK

## Config
 - appId (5ed6978e37379057af592f53)
 - fundingAccessToken (https://handcash-web.firebaseapp.com/#/authorizeApp?appId=5ed6978e37379057af592f53)
 - admin_token 

First things first:
`npm install`

## Hello world 🙂
`npm run start`

## Stress testing 😳
`npm run stress-test`

## Stress testing (with parallelization) 🤯
`npm run stress-test-parallel`

## Create Testers 🤖

`npm run create-bots <numberOfTesters> <armyNumber>` 

defaults:
- numberOfTesters=100
- armyNumber=1 

## Top up Testers :money_with_wings: 

`npm run top-up <amountUSD> <armyNumber>`

defaults:
- armyNumber=1 

## Time based stress testing with Bot Army 🤖🤖🤖
`npm run bot-timed-stress-test <numberOfSeconds> <armyNumber>`

defaults:
- numberOfSeconds=60
- armyNumber=1 

## Mult-send stress test

`npm run multi-send-stress-test <numberOfSeconds> <armyNumber>`

## Docker 🚀 🚀 🚀 
Run timed stress test with 4 armies

`docker-compose up`

## Defund the police :no_entry_sign: 👮‍♂️  :oncoming_police_car: 

Returns all funds back to the `fundingAccessToken`

`npm run defund-the-police`
