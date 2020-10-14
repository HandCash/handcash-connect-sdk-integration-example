const {HandCashCloudAccount, Environments} = require('@handcash/handcash-connect-beta');
const fs = require('fs');
const appId = '5ed6978e37379057af592f53';
const fundingAccessToken = '2eee4324125b74e62565be3090ce67f14333c68b18b784655ee6665b8a225609&';
const topUpAmount = .01;

(async () => {   
    let testers; 
    try {
        const jsonString = fs.readFileSync(`./testers/${appId}.json`)
        testers = JSON.parse(jsonString)
      } catch(err) {
        console.log(err.message)
      }
    const cloudAccount = HandCashCloudAccount.fromAuthToken(
        fundingAccessToken,
        Environments.iae,
    );

    console.log(`Sending 1 cent to ${testers.items.length} testers`)

    let i,j,temparray,chunk = 200;
    for (i=0,j=testers.items.length; i<j; i+=chunk) {
        temparray = testers.items.slice(i,i+chunk);
        
        const paymentResult = await cloudAccount.wallet.pay({
            description: 'Top up',
            appAction: 'ping',
            payments: temparray.map((account) => {
                return { destination: account.alias, currencyCode: 'USD', sendAmount: topUpAmount}
            })
        })
        console.log(paymentResult);
    }

})();