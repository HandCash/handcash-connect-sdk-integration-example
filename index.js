/* eslint-disable no-console */
/* eslint-disable max-len */
const { HandCashCloudAccount, AppAuthorization } = require('handcash-connect');

const cloudAccount = HandCashCloudAccount.fromCredentials({
    userAuthorizationToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJhcHBJZCI6IjVlZDY5NzhlMzczNzkwNTdhZjU5MmY1MyIsInVzZXJJZCI6IjVlYjY4MWQxMzIwNjVkMDA1Mjk2NGUwMiIsImV4cGlyYXRpb25UaW1lc3RhbXAiOjk5OTE1NzQ1ODB9.WeurQYxI4AYjhb5IAendXsIXrPTHReIEwmufDSBtAJcJbpwR0wA4u57OqvUStVNsuxUfFlVj90eY4so7EA6eiw',
    signingToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpZCI6InJqc2VpYmFuZUBnbWFpbC5jb20iLCJleHBpcmF0aW9uVGltZXN0YW1wIjo5OTk2NjI0OTY2NzI1fQ.E1mkkG7wWme2ItUWR7nuOEq5m0bJ16o7t8saAixRnCdcrUOQosiam-YQr6wYWA_3iCj2mB_l9I8XwY-enirtMQ',
});

(async () => {
    try {
        const redirectionLoginUrl = await AppAuthorization.getRedirectionLoginUrl('1234567890');
        console.log(`Redirection login URL: ${redirectionLoginUrl}`);

        const localCurrencyCode = await cloudAccount.profile.getLocalCurrencyCode();
        console.log(`Local currency: ${localCurrencyCode}`);

        const publicProfile = await cloudAccount.profile.getPublicProfile();
        console.log(`Public Profile: ${JSON.stringify(publicProfile)}`);

        const privateProfile = await cloudAccount.profile.getPrivateProfile();
        console.log(`Private Profile: ${JSON.stringify(privateProfile)}`);

        const balance = await cloudAccount.wallet.getBalance();
        console.log(`Balance: ${JSON.stringify(balance)}`);

        const paymentResult = await cloudAccount.wallet.pay({
            description: 'Testing SDK',
            payments: [
                { destination: 'nosetwo', currencyCode: 'USD', sendAmount: 0.005 },
                { destination: 'rjseibane', currencyCode: 'SAT', sendAmount: 5000 },
            ],
            attachment: { format: 'json', value: {"param1": "value1", "param2": "value2"} }
        });
        console.log(`PaymentResult: ${JSON.stringify(paymentResult)}`);
    } catch (e) {
        console.error(e);
    }
})();
