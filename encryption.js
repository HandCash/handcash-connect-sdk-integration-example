/* eslint-disable no-console */
/* eslint-disable max-len */
const {HandCashCloudAccount, Environments} = require('@handcash/handcash-connect-beta');
const cloudAccount = HandCashCloudAccount.fromAuthToken(
    '7ae61183cc897ca7667f368b0d22357abf6fed2f6517fe38a734037409292a03',
    Environments.iae,
);
const {PrivateKey, PublicKey} = require('bsv');
const ECIES = require('bsv/ecies');

(async () => {
    try {
        const {publicKey, privateKey} = await cloudAccount.profile.getEncryptionKeypair();
        console.log(publicKey);

        const ecPrivateKey = PrivateKey.fromWIF(privateKey);
        const ecPublicKey = PublicKey.fromString(publicKey);
        const plainText = 'hello!';

        const encryptedBuffer = ECIES().publicKey(ecPublicKey).encrypt(plainText);
        console.log(encryptedBuffer.toString('base64'));

        const decryptedBuffer = ECIES().privateKey(ecPrivateKey).decrypt(encryptedBuffer);
        console.log(decryptedBuffer.toString('utf8'));

        console.assert(decryptedBuffer.toString('utf8') == plainText);
    } catch (e) {
        console.error(e);
    }
})();
