'use strict';

const { createCipher, createCipheriv, createDecipher, createDecipheriv, randomBytes } = require('crypto');

const algorithm = 'aes-256-ctr';
const key = 'b2df428b9929d3ace7c598bbf4e496b2'; // should be provided by user
const inputEncoding = 'utf8';
const outputEncoding = 'hex';
const prefix = 'crypt';

/**
 * Encrypt using an initialisation vector
 * @param {string} value to encrypt
 */
let encrypt = (value) => {
    const iv = new Buffer(randomBytes(16));
    const cipher = createCipheriv(algorithm, key, iv);
    let crypted = cipher.update(value, inputEncoding, outputEncoding);
    crypted += cipher.final(outputEncoding);
    return `${prefix}:${iv.toString('hex')}:${crypted.toString()}`;
}

/**
 * Decrypt using an initialisation vector
 * @param {string} value value to decrypt
 */
let decrypt = (value) => {
    let  textParts = value.split(':');
    if (textParts.length === 3 && textParts[0] === prefix) {
        let realValue = `${textParts[1]}:${textParts[2]}`;
        textParts = realValue.split(':');

        //extract the IV from the first half of the value
        const IV = new Buffer(textParts.shift(), outputEncoding);

        //extract the encrypted text without the IV
        const encryptedText = new Buffer(textParts.join(':'), outputEncoding);

        //decipher the string
        const decipher = createDecipheriv(algorithm, key, IV);
        let decrypted = decipher.update(encryptedText, outputEncoding, inputEncoding);
        decrypted += decipher.final(inputEncoding);
        return decrypted.toString();
    } else {
        // value is not encrupted by me !!
        return value;
    }
}
/**
 * Decrypt if necessary the password property of the SSH Connection Param object
 * passed as argument. If no 'password' property exists, a unmodified clone of the SSH 
 * connection opbject is returned.
 * 
 * **NOTE** : the returned object is ALWAYS a clone of the input argument
 */
let decryptPassword = (sshConnectionParams) => {
    let result = Object.assign({},sshConnectionParams);
    if( result.hasOwnProperty('password')) {
        result.password = decrypt(sshConnectionParams.password);
    }
    return result;
}
module.exports = {
    "encrypt": encrypt,
    "decrypt": decrypt,
    "decryptPassword" : decryptPassword
};
