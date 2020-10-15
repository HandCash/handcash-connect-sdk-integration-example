require('dotenv').config()
const {HandCashCloudAccount, Environments} = require('@handcash/handcash-connect-beta');
const fs = require('fs');
const appId = process.env.appId;
const fundingAccessToken = process.env.fundingAccessToken;
const topUpAmount =  process.argv[2];
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
const chalk = require('chalk');
const yes = ['y', 'yes'];

(async () => {   
    
    try {
        if(!fundingAccessToken){
            console.log(chalk.red("fundingAccessToken not set get one here https://handcash-web.firebaseapp.com/#/authorizeApp?appId=5ed6978e37379057af592f53"))
            process.exit()
        }
        if(!topUpAmount){
            console.log(red, "Please provide top-up amount in USD like ... \nnpm run top-up .01")
            process.exit()
        }

        const jsonString = fs.readFileSync(`./testers/${appId}.json`)
        const testers = (JSON.parse(jsonString)).items

        const cloudAccount = HandCashCloudAccount.fromAuthToken(
            fundingAccessToken,
            Environments.iae,
        );
        const { publicProfile, privateProfile } = await cloudAccount.profile.getCurrentProfile();


        rl.setPrompt(chalk.yellow(`Send ${topUpAmount} to ${testers.length} (${topUpAmount*testers.length} USD) Tester Accounts from ${publicProfile.handle}? [Y | N] `));
        rl.prompt();

        const res = await new Promise(( resolve , reject) => {
            let response
            rl.on('line', (userInput) => {
                response = userInput;
                rl.close();
            });
    
            rl.on('close', () => {
                resolve(response.toLowerCase());
            });
    
        });
       if(!yes.includes(res)){
           console.log(chalk.red('Canceling transaction'))
       }
 
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
        process.exit()
    }
})();
