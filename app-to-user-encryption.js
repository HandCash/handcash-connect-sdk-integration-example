/* eslint-disable no-console */
/* eslint-disable max-len */
const {HandCashCloudAccount, Environments} = require('@handcash/handcash-connect');
const cloudAccount = handCashConnect.getAccountFromAuthToken(
    '7ae61183cc897ca7667f368b0d22357abf6fed2f6517fe38a734037409292a03', Environments.iae,
);
const {PrivateKey, PublicKey} = require('bsv');
const ECIES = require('bsv/ecies');

(async () => {
    try {
        const {publicKey, privateKey} = await cloudAccount.profile.getEncryptionKeypair();
        console.log(publicKey);

        const userEcPrivateKey = PrivateKey.fromWIF(privateKey);
        const userEcPublicKey = PublicKey.fromString(publicKey);
        const appEcPrivateKey = PrivateKey.fromRandom();
        const appEcPubicKey = PublicKey.fromPrivateKey(appEcPrivateKey);
        const plainText = 'hello!';

        const encryptedBufferFromUserToApp = ECIES().publicKey(appEcPubicKey).encrypt(plainText);
        console.log(encryptedBufferFromUserToApp.toString('base64'));
        const decryptedBufferFromUserToApp = ECIES().privateKey(appEcPrivateKey).decrypt(encryptedBufferFromUserToApp);
        console.log(decryptedBufferFromUserToApp.toString('utf8'));
        console.assert(decryptedBufferFromUserToApp.toString('utf8') == plainText);

        const encryptedBufferFromAppToUser = ECIES().publicKey(userEcPublicKey).encrypt(plainText);
        console.log(encryptedBufferFromAppToUser.toString('base64'));
        const decryptedBufferFromAppToUser = ECIES().privateKey(userEcPrivateKey).decrypt(encryptedBufferFromAppToUser);
        console.log(decryptedBufferFromAppToUser.toString('utf8'));
        console.assert(decryptedBufferFromAppToUser.toString('utf8') == plainText);
    } catch (e) {
        console.error(e);
    }
})();
