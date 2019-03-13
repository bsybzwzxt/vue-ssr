const crypto = require('crypto');
const HASHKEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function filterRouter(RouterList, url) {
    let type = Object.prototype.toString.call(RouterList);
    if (type === '[object Array]') {
        for (let item of RouterList) {
            if (item === url) {
                return true;
            }
        }
    }
    if (type === '[object String]') {
        if (RouterList === url) {
            return true;
        }
    }
}

//加密
function encryption (data, key, iv) {
    iv = iv || "";
    key = key || HASHKEY;
    let cipherChunks = [];
    let cipher = crypto.createCipheriv('aes-256-ecb', key, iv);
    // cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update(data, 'utf8', 'base64'));
    cipherChunks.push(cipher.final('base64'));
    return cipherChunks.join('');
}

//解密
function decryption (data, key, iv) {
    if (!data) {
        return "";
    }
    iv = iv || "";
    key = key || HASHKEY;
    let cipherChunks = [];
    let decipher = crypto.createDecipheriv('aes-256-ecb', key, iv);
    // decipher.setAutoPadding(true);
    cipherChunks.push(decipher.update(data, 'base64', 'utf8'));
    cipherChunks.push(decipher.final('utf8'));
    return cipherChunks.join('');
}

module.exports = {
    filterRouter,
    encryption,
    decryption
};


