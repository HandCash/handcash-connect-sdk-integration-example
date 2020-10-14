/* eslint-disable no-console */
/* eslint-disable max-len */
const {HandCashCloudAccount, Environments} = require('@handcash/handcash-connect-beta');
const pLimit = require('p-limit');
const limit = pLimit(3);
const fs = require('fs');
const {PrivateKey} = require('bsv');
const appId = '5ed6978e37379057af592f53';
const sendAmount = 600;
const numberOfTransactions = 3;

(async () => {
    let successCount = 0;
    let errorCount = 0;
    try {
        const jsonString = fs.readFileSync(`./testers/${appId}.json`)
        const testers = JSON.parse(jsonString)

        const cloudAccounts = testers.items.map((tester)=> {
            return HandCashCloudAccount.fromAuthToken(
                PrivateKey(tester.privateKey).toHex(),
                Environments.iae,
            );
        })
        let accountsWithBalance = await Promise.all(cloudAccounts.map(async (account, index) => {
            const balance =  await  account.wallet.getSpendableBalance();
            return {
                account,
                balance,
                alias: testers.items[index].alias,
            }
        }))
        accountsWithBalance = accountsWithBalance.filter((accountWithBalance) => accountWithBalance.balance.spendableSatoshiBalance > (sendAmount * numberOfTransactions))

        await Promise.all(accountsWithBalance.map((account, index) => limit(() => {
            return Array(numberOfTransactions)
            .fill(0)
            .map(() => {
                alias = index !== accountsWithBalance.length - 1 ? accountsWithBalance[index + 1].alias : accountsWithBalance[0].alias;
                const paymentDestinations = [{
                    destination: alias, currencyCode: 'SAT', sendAmount: sendAmount,
                }]
                return account.account.wallet.pay({
                    description: 'Pew pew',
                    appAction: 'tip',
                    payments: paymentDestinations,
                    attachment: {format: 'base64', value: 'cGV3IHBldyBwZXc='}
                })
                .then((paymentResult) => {
                    console.log('success', paymentResult.transactionId)
                })
                .then(_ => successCount++)
                .catch((error) => {
                    console.log(account.alias, error.message)
                    errorCount++;
                })
            })})));

        console.error(`Stress Test Completed - Successes: ${successCount}, Errors: ${errorCount}`);

    } catch(err){
        console.log(err);
    }
})();
