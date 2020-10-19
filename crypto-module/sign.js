const http = require('superagent');
const pLimit = require('p-limit');
const limit = pLimit(10);
const time = Number(process.argv[2] || 60);
const apiEndpoint = 'https://crypto-module.iae.cloud.handcash.io';
const chalk = require('chalk');

function getSign() {
   return http.post(`${apiEndpoint}/sign`).send(
      {
         'signatureRequestItems': [{
            'inputIndex': 0,
            'derivationPath': 'm/1/18',
            'signatureHash': '37c8dbe24e14073958444f45db5b34c4496e87019ab9ce4ce06821c516b5c02d',
            'partialPrivateKeyParameters': {
               'userId': '507e181e810c19729de860ea',
               'extendedPrivateKey': 'xprv9s21ZrQH143K2Dc3BqgnQy1hkSvk2hF5W1joroE4HJKk3QeLdRAeT46DvcdcWz9JcK9ZAUBadk3aPpm1s5857t1PRQs2vpbSiNWKB4Kfve1',
               'path': 'm/1',
               'index': 18,
            },
         },
            {
               'inputIndex': 1,
               'derivationPath': 'm/1/19',
               'signatureHash': '37c8dbe24e14073958444f45db5b34c4496e87019ab9ce4ce06821c516b5c02d',
               'partialPrivateKeyParameters': {
                  'userId': '507e181e810c19729de860ea',
                  'extendedPrivateKey': 'xprv9s21ZrQH143K2Dc3BqgnQy1hkSvk2hF5W1joroE4HJKk3QeLdRAeT46DvcdcWz9JcK9ZAUBadk3aPpm1s5857t1PRQs2vpbSiNWKB4Kfve1',
                  'path': 'm/1',
                  'index': 19,
               },
            }],
         'paillierPublicKey': '89a5384a305c8b3783ab09a163cd4a7e35e92bc3defcb9b4989a6912ae4814d82b51af8cc363748189c77c51bdcb95ee527ffbb5e248f6d1ec8fc0b766db193828f838e8ab729099a8a4feffd055b66b5c7c3580f5354b0605ea99b72b524b7fdc58901c440f97652a3d1a4796828fad0bf4538b2470973ee6fcbfc52cfaee3ba4741911a64b540b9e033b0c3e158cc7fab03a281be1f2c92bcd829b719b03eb152aed9bbeab627f0293106145909a7ec1a9af5b4c4302c078f637a17fc88208d90926641de50ac2fe8287197b08731874158a01b7f6640ca80b724f938964962775f75db50c24cf5936db116427d17e20158f67b683f7ed640ace97ee5df537',
         'paillierPrivateKey': {
            'p': 'b3068e7ce4834a9433b8baddcb47bf472fb8dfc7300c8d3834016cfff1eab3eafcab75a35ae74c320d34da49f982826fa29a8d54921ce18a934dab45cce4297dd1042cfce552632da555ef47bead686ec99c8aac8b53863fcf7a027be24169ce9066dc4629b5862196ad95e6c80ee5a50b4ec84ca04132728a6fd12e37f76aed',
            'q': 'c4d3eba607bed70d2a031d5be782b8f717737c1f84c97130a0e539bb283f7689777c805823439bf9576bc64e897635a08c52676d5ca26bebe49b23ec1eb87d7de4d44f2b2cfbeefc33117dcab4ba045f358ce4aaa47f8d2f9dde57555d42f010723826c643085f4f2e490650f22ce826068ec2a1ce48cfafffab0aef3ce54833',
         },
         'originalRequest': {
            'method': 'POST',
            'originalUrl': '/connect/pay',
            'bodyAsString': '{"receivers":[{"destination":"nosetwo@internal.handcash.io","currencyCode":"USD",' +
               '"sendAmount":0.005},{"destination":"keyless@internal.handcash.io",' +
               '"currencyCode":"SAT","sendAmount":5000}],"description":"From Connect SDK",' +
               '"attachment":{"format":"json","value":{"param1":"value1","param2":"value2"}}}',
            'timestamp': '2020-07-21T06:39:41.350Z',
            'publicKey': '02ec0c73710b048a39e3b0d6308bd4a20cbb38301074fa8ff28c9f1f1728f2b0fb',
            'signature': '30440220542c1b96c00f31f2649c7c98567980721350c84a449296f6c23756464afce46502204f5d4f5cb9ee2386cb6b302fd58987ef0540e85e097b5b20fca241ae939be3ac',
         },
      },
   );
}

function getDerive() {
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
         }],
   });
}

async function getPromise(){
   await getDerive();
   await getSign();
}

(async () => {
    try {
        const start = new Date();
        let now = new Date();
        let successCount = 0;
        let errorCount = 0;

        while(Number(((now - start) / 1000)) < time){
            const res = Array(100).fill(0).map(() => limit(() => {
                return getPromise()
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
