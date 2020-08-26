/* eslint-disable no-console */
/* eslint-disable max-len */
const {HandCashCloudAccount, AppAuthorization, Environments} = require('@handcash/handcash-connect-beta');
const cloudAccount = HandCashCloudAccount.fromAuthToken(
    'ddddff1f6e9e75e08ac0e728a7b87930046089b4705731d4daddd43feea49995',
    Environments.iae,
);

(async () => {
    try {
        const redirectionLoginUrl = await AppAuthorization.getRedirectionLoginUrl('1234567890', Environments.iae);
        console.log(`Redirection login URL: ${redirectionLoginUrl}`);

        const publicProfile = await cloudAccount.profile.getPublicProfile();
        console.log(`Public Profile: ${JSON.stringify(publicProfile)}`);

        const privateProfile = await cloudAccount.profile.getPrivateProfile();
        console.log(`Private Profile: ${JSON.stringify(privateProfile)}`);

        const balance = await cloudAccount.wallet.getBalance();
        console.log(`Balance: ${JSON.stringify(balance)}`);

        const paymentResult = await cloudAccount.wallet.pay({
            description: 'From Connect SDK',
            payments: [
                {destination: 'nosetwo@internal.handcash.io', currencyCode: 'USD', sendAmount: 0.005},
            ],
            attachment: {format: 'json', value: {param1: "value1", param2: "value2"}}
        });
        console.log(`PaymentResult: ${JSON.stringify(paymentResult)}`);
    } catch (e) {
        console.error(e);
    }
})();
