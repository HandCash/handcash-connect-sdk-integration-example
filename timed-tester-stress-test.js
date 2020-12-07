require('dotenv').config()
const {HandCashConnect, Environments} = require('@handcash/handcash-connect-beta');
const pLimit = require('p-limit');
const limit = pLimit(3);
const fs = require('fs');
const { PrivateKey } = require('bsv');
const chalk = require('chalk');

const sendAmount = 600;
const time = Number(process.argv[2] || 60);
const army = Number(process.argv[3]) || 1;
const handCashConnect = new HandCashConnect('5fbe19d9088ee710cf8fc614', Environments.iae);

(async () => {

    try {
        const start = new Date();
        let now = new Date();
        let successCount = 0;
        let errorCount = 0;
        const jsonString = fs.readFileSync(`./testers/${army}.json`)
        const testers = (JSON.parse(jsonString)).items;
        console.log(chalk.cyan(`Running Stress Test with bot Army ${army} with ${testers.length} bots for ${time} seconds...`))
        let cloudAccounts = testers.map((tester) => {
            return handCashConnect.getAccountFromAuthToken(PrivateKey(tester.privateKey).toHex());
        });

        const aliases = await Promise.all(cloudAccounts.map((account)=> limit(()=> {
            return account.profile.getCurrentProfile();
        })));

        cloudAccounts = cloudAccounts.map((account, index) => {
            return Object.assign(account, {alias: aliases[index].publicProfile.handle})
        })
        while(Number(((now - start) / 1000)) < time && cloudAccounts.length > 2){
            let aliasesToRemove = [];
            const res = cloudAccounts.map((account, index) =>
            limit(() => {
                    destinationAlias = index !== cloudAccounts.length - 1 ? cloudAccounts[index + 1].alias : cloudAccounts[0].alias;

                    const paymentDestinations = [{
                        destination: destinationAlias, currencyCode: 'SAT', sendAmount: sendAmount,
                    }]
                    return account.wallet.pay({
                        description: 'Pew pew',
                        appAction: 'tip',
                        payments: paymentDestinations,
                        attachment: {format: 'base64', value: 'cGV3IHBldyBwZXc='}
                    })
                    .then((paymentResult) => {
                        console.log(`success`, chalk.green(`${paymentResult.transactionId}`))
                    })
                    .then(_ => successCount++)
                    .catch((error) => {
                        aliasesToRemove.push(account.alias);
                        cloudAccounts = cloudAccounts.filter((cloudAccount) => account.alias !== cloudAccount.alias);
                        console.log(account.alias, chalk.red(error.message))
                        errorCount++;
                    })
                }));
            await Promise.all(res)
            cloudAccounts = cloudAccounts.filter((account) =>  !aliasesToRemove.includes(account.alias));
            now = new Date();

        }
        console.error(`Stress Test Completed - Successes: ${chalk.green(successCount)}, Errors: ${chalk.red(errorCount)}`);
    } catch(err){
        console.log(err);
    }
})();
