/* eslint-disable no-console */
/* eslint-disable max-len */
const {HandCashCloudAccount, Environments} = require('@handcash/handcash-connect-beta');
const cloudAccount = HandCashCloudAccount.fromAuthToken(
    '3362abede23a6364db469bdb74dd04022ea786937cc8de9a0b0be410d3ed2f97',
    Environments.iae,
);

(async () => {
    try {
        const publicProfile = await cloudAccount.profile.getPublicProfile();
        await Promise.all(
            Array(10)
                .fill(0)
                .map(_ => cloudAccount.wallet.pay({
                    description: 'Stress test',
                    payments: [
                        {destination: publicProfile.handle, currencyCode: 'USD', sendAmount: 0.005},
                    ],
                    attachment: {format: 'json', value: {param1: "value1", param2: "value2"}}
                })
                    .then(paymentResult => console.log(JSON.stringify(paymentResult)))
                    .catch(error => console.error(error)))
        );
    } catch (e) {
        console.error(e);
    }
})();
