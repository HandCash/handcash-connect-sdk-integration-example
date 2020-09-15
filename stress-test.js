/* eslint-disable no-console */
/* eslint-disable max-len */
const {HandCashCloudAccount, Environments} = require('@handcash/handcash-connect-beta');
const pLimit = require('p-limit');

const limit = pLimit(3);

(async () => {
    try {
        let successCount = 0;
        let errorCount = 0;
        const cloudAccount = HandCashCloudAccount.fromAuthToken(
            'd42ce7ab6f79431e32af1204c44f5b91d69fe6a06846e124a15b580e2f280545',
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
                    .catch(error => console.error(JSON.stringify(error)))
                    .then(_ => errorCount++))));
    } catch (e) {
        console.error(e);
    }
    console.error(`Stress Test Completed - Successes: ${successCount}, Errors: ${errorCount}`);
})();
