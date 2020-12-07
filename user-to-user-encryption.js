/* eslint-disable no-console */
/* eslint-disable max-len */
const {HandCashCloudAccount, Environments} = require('@handcash/handcash-connect-beta');
const cloudAccountOne = HandCashCloudAccount.fromAuthToken(
    '7ae61183cc897ca7667f368b0d22357abf6fed2f6517fe38a734037409292a03',
    Environments.iae.apiEndpoint,
);
const cloudAccountTwo = HandCashCloudAccount.fromAuthToken(
    'd3daf9b6730dd07a01539f49b2c8b3cbd08b0a63d8bec06af6a86645ad0cdfa3',
    Environments.iae.apiEndpoint,
);
const {PrivateKey, PublicKey} = require('bsv');
const ECIES = require('bsv/ecies');

(async () => {
    try {
        const {privateKey: privateKeyOne, publicKey: publicKeyOne} = await cloudAccountOne.profile.getEncryptionKeypair();
        const {privateKey: privateKeyTwo, publicKey: publicKeyTwo} = await cloudAccountTwo.profile.getEncryptionKeypair();

        const ecPrivateKeyOne = PrivateKey.fromWIF(privateKeyOne);
        const ecPublicKeyOne = PublicKey.fromString(publicKeyOne);
        const ecPrivateKeyTwo = PrivateKey.fromWIF(privateKeyTwo);
        const ecPublicKeyTwo = PublicKey.fromString(publicKeyTwo);
        const plainText = 'hello!';

        const encryptedBuffer = ECIES().privateKey(ecPrivateKeyOne).publicKey(ecPublicKeyTwo).encrypt(plainText);
        console.log(encryptedBuffer.toString('base64'));

        const decryptedBuffer = ECIES().privateKey(ecPrivateKeyTwo).publicKey(ecPublicKeyOne).decrypt(encryptedBuffer);
        console.log(decryptedBuffer.toString('utf8'));

        console.assert(decryptedBuffer.toString('utf8') == plainText);
    } catch (e) {
        console.error(JSON.stringify(e));
    }
})();
