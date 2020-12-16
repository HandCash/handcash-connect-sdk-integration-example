/* eslint-disable no-console */
/* eslint-disable max-len */
const {HandCashConnect, Environments} = require('@handcash/handcash-connect');
const handCashConnect = new HandCashConnect('5fbe19d9088ee710cf8fc614', Environments.iae);

const authToken = process.argv[2];
const cloudAccount = handCashConnect.getAccountFromAuthToken(authToken);

(async () => {
    try {
        console.log(cloudAccount);
        const redirectionLoginUrl = handCashConnect.getRedirectionUrl();
        console.log(`Redirection login URL: ${redirectionLoginUrl}`);

        const previousPayment = await cloudAccount.wallet.getPayment('0cd919d94f3ebff4d11fd95d6d3cdb0be9b749ba353b60070b4e7d77132cc629');
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
