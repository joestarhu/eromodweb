import CryptoJS from 'crypto-js'

// 先要安装引入
// npm install --save crypto-js

function encryptString(value) {
    let sk = '0f35268f93594811b1fb81e772a9e256'
    let key = CryptoJS.enc.Utf8.parse(sk);
    let srcs = CryptoJS.enc.Utf8.parse(value);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString()
}


export { encryptString }