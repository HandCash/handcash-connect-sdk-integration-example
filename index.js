/* eslint-disable no-console */
/* eslint-disable max-len */
const {HandCashCloudAccount, AppAuthorization, Environments} = require('@handcash/handcash-connect-beta');
const cloudAccount = HandCashCloudAccount.fromAuthToken(
    '7ae61183cc897ca7667f368b0d22357abf6fed2f6517fe38a734037409292a03',
    Environments.iae,
);

(async () => {
    try {
        const redirectionLoginUrl = await AppAuthorization.getRedirectionLoginUrl('1234567890', Environments.iae);
        console.log(`Redirection login URL: ${redirectionLoginUrl}`);

        const previousPayment = await cloudAccount.wallet.getPayment('0a25cc07953de261e2f7dbc3601a61d4e74f96b99cd55c0755df9b9888cdccbc');
        console.log(`Previous payment: ${JSON.stringify(previousPayment)}`);

        const { publicProfile, privateProfile } = await cloudAccount.profile.getCurrentProfile();
        console.log(`Public Profile: ${JSON.stringify(publicProfile)}`);
        console.log(`Private Profile: ${JSON.stringify(privateProfile)}`);

        const balance = await cloudAccount.wallet.getSpendableBalance();
        console.log(`Balance: ${JSON.stringify(balance)}`);

        const paymentResult = await cloudAccount.wallet.pay({
            description: 'From Connect SDK',
            appAction: 'ping',
            payments: [
                {destination: publicProfile.handle, currencyCode: 'USD', sendAmount: 0.005},
            ],
            attachment: {format: 'json', value: {param1: "value1", param2: "value2"}}
        });
        console.log(`PaymentResult: ${JSON.stringify(paymentResult)}`);
    } catch (e) {
        console.error(e);
    }
})();
