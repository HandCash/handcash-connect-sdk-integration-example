require('dotenv').config()
const {HandCashCloudAccount, Environments} = require('@handcash/handcash-connect-beta');
const pLimit = require('p-limit');
const limit = pLimit(3);
const fs = require('fs');
const { PrivateKey } = require('bsv');
const fundingAccessToken = process.env.fundingAccessToken;
const chalk = require('chalk');
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

    const funder = HandCashCloudAccount.fromAuthToken(
        fundingAccessToken,
        Environments.iae,
    );

    const destinationAlias = await funder.profile.getCurrentProfile().then(profile => profile.publicProfile.handle)

    files.forEach((file) => { 
        const jsonString = fs.readFileSync(`./testers/${file}`)
        testers = testers.concat((JSON.parse(jsonString)).items);
    });

    let cloudAccounts = testers.map((tester) =>  {
        return HandCashCloudAccount.fromAuthToken(
            PrivateKey(tester.privateKey).toHex(),
            Environments.iae,
        );
    });

    const balances = await Promise.all(cloudAccounts.map((account)=> limit(()=> {
        return account.wallet.getSpendableBalance();
    })));

    cloudAccounts = await Promise.all(cloudAccounts.map((account, index) => limit(() => {

        return account.wallet.pay({
            description: 'Pew pew',
                        appAction: 'tip',
                        payments:  [{ destination: destinationAlias, currencyCode: 'SAT', sendAmount: balances[index].spendableSatoshiBalance}],
                    }).then((paymentResult) => {
                        console.log(`success`, chalk.green(`${paymentResult.transactionId}`))
                    })
                    .catch((error) => {
                        console.log(account.alias, chalk.red(error.message))
                    })
        })));
})();
