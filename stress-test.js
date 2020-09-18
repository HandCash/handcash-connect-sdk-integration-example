/* eslint-disable no-console */
/* eslint-disable max-len */
const {HandCashCloudAccount, Environments} = require('@handcash/handcash-connect-beta');
const pLimit = require('p-limit');

const limit = pLimit(3);

(async () => {
    let successCount = 0;
    let errorCount = 0;
    try {
        const cloudAccount = HandCashCloudAccount.fromAuthToken(
            '7ae61183cc897ca7667f368b0d22357abf6fed2f6517fe38a734037409292a03',
            Environments.iae,
        );
        const publicProfile = await cloudAccount.profile.getCurrentProfile().then(profile => profile.publicProfile);
        await Promise.all(
            Array(50)
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
