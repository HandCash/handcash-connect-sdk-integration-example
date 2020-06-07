/* eslint-disable no-console */
/* eslint-disable max-len */
const { HandCashCloudAccount, AppAuthorization } = require('handcash-connect');

const cloudAccount = HandCashCloudAccount.fromCredentials({
    userAuthorizationToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJhcHBJZCI6IjVlZDY5NzhlMzczNzkwNTdhZjU5MmY1MyIsInVzZXJJZCI6IjVlYjY4MWQxMzIwNjVkMDA1Mjk2NGUwMiIsImV4cGlyYXRpb25UaW1lc3RhbXAiOjE1OTE1NjMyNjl9.oo4TlW035cRzV_7HD8ijiViSpYQHIdW_O94Mj_pD6T-gGeBlk3MYvbt4i5Kba5A7pWU2izf7CX-dyS8G53Lc8Q',
    signingToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpZCI6InJqc2VpYmFuZUBnbWFpbC5jb20iLCJleHBpcmF0aW9uVGltZXN0YW1wIjoxNTk2NjI0OTY2NzI1fQ.81905to-ATsOGC9mqMwLeVG556bBo4FYViD0LdM4NV6vur230BGL-PXL7G1fdvKIl0B-3eKCwrMj49KDgirGxQ',
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
        });
        console.log(`PaymentResult: ${JSON.stringify(paymentResult)}`);
    } catch (e) {
        console.error(e);
    }
})();
