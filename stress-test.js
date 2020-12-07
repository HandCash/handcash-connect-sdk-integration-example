/* eslint-disable no-console */
/* eslint-disable max-len */
const {HandCashConnect, Environments} = require('@handcash/handcash-connect-beta');
const handCashConnect = new HandCashConnect('5fbe19d9088ee710cf8fc614', Environments.iae);
const pLimit = require('p-limit');

const limit = pLimit(5);
const totalPayments = 20;
const authToken = process.argv[2];

(async () => {
    let successCount = 0;
    let errorCount = 0;
    try {
        const cloudAccount = handCashConnect.getAccountFromAuthToken(authToken);
        const publicProfile = await cloudAccount.profile.getCurrentProfile().then(profile => profile.publicProfile);
        await Promise.all(
            Array(totalPayments)
                .fill(0)
                .map(() => limit(() => cloudAccount.wallet.pay({
                        description: 'Pew pew',
                        appAction: 'tip',
                        payments: [
                            {destination: publicProfile.handle, currencyCode: 'USD', sendAmount: 0.005},
                        ],
                        attachment: {format: 'base64', value: 'cGV3IHBldyBwZXc='}
                    })
                        .then(paymentResult => console.log(JSON.stringify(paymentResult)))
                        .then(_ => successCount++)
                        .catch((error) => {
                            console.error(JSON.stringify(error));
                            errorCount++;
                        })
                )));
    } catch (e) {
        console.error(e);
    }
    console.error(`Stress Test Completed - Successes: ${successCount}, Errors: ${errorCount}`);
})();
