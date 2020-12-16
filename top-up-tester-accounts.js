require('dotenv').config()
const {HandCashConnect, Environments} = require('@handcash/handcash-connect');
const fs = require('fs');
const chalk = require('chalk');

const fundingAccessToken = process.env.fundingAccessToken;
const topUpAmount =  Number(process.argv[2] || .01);
const army = Number(process.argv[3]) || 1;
const handCashConnect = new HandCashConnect('5fbe19d9088ee710cf8fc614', Environments.iae);

(async () => {

    try {
        if(!fundingAccessToken){
            console.log(chalk.red("fundingAccessToken not set get one here https://handcash-web.firebaseapp.com/#/authorizeApp?appId=5ed6978e37379057af592f53"))
            process.exit()
        }

        const jsonString = fs.readFileSync(`./testers/${army}.json`)
        const testers = (JSON.parse(jsonString)).items

        const cloudAccount = handCashConnect.getAccountFromAuthToken(fundingAccessToken);

        let i,j,temparray,chunk = 200;
        for (i=0,j=testers.length; i<j; i+=chunk) {
            temparray = testers.slice(i,i+chunk);

            const paymentResult = await cloudAccount.wallet.pay({
                description: 'Top up',
                appAction: 'ping',
                payments: temparray.map((account) => {
                    return { destination: account.alias, currencyCode: 'USD', sendAmount: topUpAmount}
                })
            })
            console.log(chalk.green('txid: ',paymentResult.transactionId));
        }
    } catch(err) {
        if(err.httpStatusCode === 409){
            console.log(chalk.red(err.message+ ' Broke Bitch!'),)
        }else{
            console.log(chalk.red(err.message))
        }
    }
    process.exit()
})();
