const http = require('superagent');
const pLimit = require('p-limit');
const limit = pLimit(3);
const time = Number(process.argv[2] || 60);
const apiEndpoint = 'https://crypto-module.iae.cloud.handcash.io';
const chalk = require('chalk');

(async () => {
    try {
        const start = new Date();
        let now = new Date();
        let successCount = 0;
        let errorCount = 0;

        while(Number(((now - start) / 1000)) < time){
            const res = Array(100).fill(0).map(() => limit(() => {
                return http.post(`${apiEndpoint}/crypto/derivation/addresses`).send({
                'params': [{
                    'userId': '123456789',
                    'extendedPublicKey': 'xpub661MyMwAqRbcFrBD6Ggpq5UbYczPuWtu2MMFPU6wSrtKGrW9a6a3qco38KHhFEyV3rYkKN7H71si6zWNHa9t1kLXCz5B1tcD5dP2p9cgCK3',
                    'extendedPrivateKey': 'xprv9s21ZrQH143K2Dc3BqgnQy1hkSvk2hF5W1joroE4HJKk3QeLdRAeT46DvcdcWz9JcK9ZAUBadk3aPpm1s5857t1PRQs2vpbSiNWKB4Kfve1',
                    'path': 'm/1',
                    'index': 0,
                    'forceUtxoAdd': true,
                  },
                  {
                    'userId': '987654321',
                    'extendedPublicKey': 'xpub661MyMwAqRbcFrBD6Ggpq5UbYczPuWtu2MMFPU6wSrtKGrW9a6a3qco38KHhFEyV3rYkKN7H71si6zWNHa9t1kLXCz5B1tcD5dP2p9cgCK3',
                    'extendedPrivateKey': 'xprv9s21ZrQH143K2Dc3BqgnQy1hkSvk2hF5W1joroE4HJKk3QeLdRAeT46DvcdcWz9JcK9ZAUBadk3aPpm1s5857t1PRQs2vpbSiNWKB4Kfve1',
                    'path': 'm/1',
                    'index': 1,
                    'forceUtxoAdd': true,
                  }]
                })
                .then(_ => successCount++)
                .catch((error) => {
                        console.log(chalk.red(error.message))
                        errorCount++;
                    })
            }))
            await Promise.all(res)
            now = new Date();
        
        }
        console.error(`Stress Test Completed - Successes: ${chalk.green(successCount)}, Errors: ${chalk.red(errorCount)}`);
    } catch(err){
        console.log(err);
    }
    process.exit()
})();