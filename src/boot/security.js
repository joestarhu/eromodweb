import CryptoJS from 'crypto-js';
import { Base64 } from 'js-base64';

// 先要安装引入
// npm install --save crypto-js
function encryptString(value) {
    let sk = '0f35268f93594811b1fb81e772a9e256'
    let key = CryptoJS.enc.Utf8.parse(sk);
    let srcs = CryptoJS.enc.Utf8.parse(value);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString()
}



// 解析JWT
function getJwtPayload(jwt) {
    let payload = JSON.parse(Base64.decode(jwt.split('.')[1]))
    return payload
}


// 解析jwt字符串
function getLoginOrg(jwt) {
    let payload = getJwtPayload(jwt)
    let loginOrg = payload['login_org'] || null
    return loginOrg
}

//
function getUserOrgs(jwt) {
    let payload = getJwtPayload(jwt)
    let userOrgs = payload['user_orgs'] || []
    return userOrgs

}

export { encryptString, getJwtPayload, getLoginOrg, getUserOrgs }