require('dotenv').config()
const {HandCashConnect, Environments} = require('@handcash/handcash-connect');
const pLimit = require('p-limit');
const limit = pLimit(3);
const fs = require('fs');
const {PrivateKey} = require('bsv');
const chalk = require('chalk');

const fundingAccessToken = process.env.fundingAccessToken;
const handCashConnect = new HandCashConnect('5fbe19d9088ee710cf8fc614', Environments.iae);

function readdirAsync(path) {
    return new Promise(function (resolve, reject) {
        fs.readdir(path, function (error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

(async () => {

    let testers = [];

    const files = await readdirAsync('./testers');

    const funder = handCashConnect.getAccountFromAuthToken(fundingAccessToken);

    const destinationAlias = await funder.profile.getCurrentProfile().then(profile => profile.publicProfile.handle)

    files.forEach((file) => {
        const jsonString = fs.readFileSync(`./testers/${file}`)
        testers = testers.concat((JSON.parse(jsonString)).items);
    });

    let cloudAccounts = testers.map((tester) => {
        return handCashConnect.getAccountFromAuthToken(PrivateKey(tester.privateKey).toHex());
    });

    const balances = await Promise.all(cloudAccounts.map((account) => limit(() => {
        return account.wallet.getSpendableBalance();
    })));

    await Promise.all(cloudAccounts.map((account, index) => limit(() => {
            if (balances[index].spendableSatoshiBalance === 0) return undefined;
            return account.wallet.pay({
                description: 'Pew pew',
                appAction: 'tip',
                payments: [{
                    destination: destinationAlias,
                    currencyCode: 'SAT',
                    sendAmount: balances[index].spendableSatoshiBalance
                }],
            })
                .then((paymentResult) => {
                    console.log(`success`, chalk.green(`${paymentResult.transactionId}`))
                })
                .catch((error) => {
                    console.log(account.alias, chalk.red(error.message))
                })
        })
    ));
})();
