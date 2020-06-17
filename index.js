/* eslint-disable no-console */
/* eslint-disable max-len */
const { HandCashCloudAccount, AppAuthorization } = require('handcash-connect');
const cloudAccount = HandCashCloudAccount.fromCredentials({
    userAuthorizationToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJhcHBJZCI6IjVlZWE0N2UzOGEyMmI3Y2Q0ZjI3YmQ3ZSIsInVzZXJJZCI6IjVlZTllYTEzODllMGMyMDAzNzMzNTRiNiIsImV4cGlyYXRpb25UaW1lc3RhbXAiOjE1OTUwMDQxOTd9.d8XH8WXjmyrmSDPIk0DGso5_z28s2ISdlYEZJZ3Z76i6lh85rDAa5L9AmmmXl8wFU_k1_6CNHntat1N-wDDXxg',
    signingToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpZCI6InJqc2VpYmFuZUBnbWFpbC5jb20iLCJleHBpcmF0aW9uVGltZXN0YW1wIjoxNTk3NTY5MTI0NTU3fQ.JNbXgvbfeLR4hXoLntjrBfMyfLkZHM0JE72B9QuG-xzcd9zqmQDYtG_yhE-70QSl2cNBpThlCJeShDQoYYZELQ',
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
            description: 'From Connect SDK',
            payments: [
                { destination: 'nosetwo@internal.handcash.io', currencyCode: 'USD', sendAmount: 0.005 },
                { destination: 'keyless@internal.handcash.io', currencyCode: 'SAT', sendAmount: 5000 },
            ],
            attachment: { format: 'json', value: {param1: "value1", param2: "value2"} }
        });
        console.log(`PaymentResult: ${JSON.stringify(paymentResult)}`);
    } catch (e) {
        console.error(e);
    }
})();
