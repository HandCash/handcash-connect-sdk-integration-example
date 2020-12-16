require('dotenv').config()
const {HandCashConnect, Environments} = require('@handcash/handcash-connect');
const pLimit = require('p-limit');
const limit = pLimit(3);
const fs = require('fs');
const { PrivateKey } = require('bsv');
const chalk = require('chalk');

const sendAmount = 600;
const numberOfTransactions = Number(process.argv[2] || 1);
const army = process.argv[3] || 1;
const handCashConnect = new HandCashConnect('5fbe19d9088ee710cf8fc614', Environments.iae);

(async () => {
    try {
        let successCount = 0;
        let errorCount = 0;
        const jsonString = fs.readFileSync(`./testers/${army}.json`)
        const testers = (JSON.parse(jsonString)).items;

        let cloudAccounts = testers.map((tester) => {
            return handCashConnect.getAccountFromAuthToken(PrivateKey(tester.privateKey).toHex());
        });

        const res = cloudAccounts.map((account, index) => {
            return Array(numberOfTransactions)
            .fill(0)
            .map(() => limit(() => {
                destinationAlias = index !== testers.length - 1 ? testers[index + 1].alias : testers[0].alias;

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
                    console.log(testers[index].alias, chalk.red(error.message))
                    errorCount++;
                })
            }))}).flat();
        await Promise.all(res)
        console.error(`Stress Test Completed - Successes: ${chalk.green(successCount)}, Errors: ${chalk.red(errorCount)}`);

    } catch(err){
        console.log(err);
    }
})();
