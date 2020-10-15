require('dotenv').config()
const {HandCashCloudAccount, Environments} = require('@handcash/handcash-connect-beta');
const pLimit = require('p-limit');
const limit = pLimit(3);
const fs = require('fs');
const { PrivateKey } = require('bsv');
const appId = process.env.appId;
const sendAmount = 600;
const numberOfTransactions = Number(process.argv[2] || 1);
console.log(numberOfTransactions)
const chalk = require('chalk');

(async () => {
    try {
        let successCount = 0;
        let errorCount = 0;
        const jsonString = fs.readFileSync(`./testers/${appId}.json`)
        const testers = (JSON.parse(jsonString)).items;

        const cloudAccounts = testers.map((tester)=> {
            return HandCashCloudAccount.fromAuthToken(
                PrivateKey(tester.privateKey).toHex(),
                Environments.iae,
            );
        })
        
        let accountsWithBalance = await Promise.all(cloudAccounts.map(async (account, index) => {
            const balance =  await account.wallet.getSpendableBalance();
            return {
                account,
                balance,
                alias: testers[index].alias,
            }
        }))
        accountsWithBalance = accountsWithBalance.filter((accountWithBalance) => accountWithBalance.balance.spendableSatoshiBalance > (sendAmount * numberOfTransactions))
        const res = accountsWithBalance.map((account, index) => {
            return Array(numberOfTransactions)
            .fill(0)
            .map(() => limit(() => {
                destinationAlias = index !== accountsWithBalance.length - 1 ? accountsWithBalance[index + 1].alias : accountsWithBalance[0].alias;

                const paymentDestinations = [{
                    destination: destinationAlias, currencyCode: 'SAT', sendAmount: sendAmount,
                }]
                return account.account.wallet.pay({
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
                    console.log(account.alias, chalk.red(error.message))
                    errorCount++;
                })
            }))}).flat();
        await Promise.all(res)
        console.error(`Stress Test Completed - Successes: ${chalk.green(successCount)}, Errors: ${chalk.red(errorCount)}`);

    } catch(err){
        console.log(err);
    }
})();
