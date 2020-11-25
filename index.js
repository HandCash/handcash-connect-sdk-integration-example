/* eslint-disable no-console */
/* eslint-disable max-len */
const {HandCashCloudAccount, AppAuthorization} = require('@handcash/handcash-connect-beta');
const authToken = process.argv[2];
const cloudAccount = HandCashCloudAccount.fromAuthToken(authToken);

(async () => {
    try {
        const redirectionLoginUrl = await AppAuthorization.getRedirectionLoginUrl('5fbe19d9088ee710cf8fc614');
        console.log(`Redirection login URL: ${redirectionLoginUrl}`);

        const previousPayment = await cloudAccount.wallet.getPayment('b808d3113cca45ebd842fb114ca794fc3bc91656a5f8e313e8df373759f99e5c');
        console.log(`Previous payment: ${JSON.stringify(previousPayment)}`);

        const {publicProfile, privateProfile} = await cloudAccount.profile.getCurrentProfile();
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
        console.error(JSON.stringify(e));
    }
})();
