const axios = require("axios");
const uuid = require("uuid");
const crypto = require('crypto');

function createDataMachineMiHoYo(authcookie) {
    const instance = axios.create({
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.46',
            Cookie: authcookie,
            Accept: 'application/json;charset=utf-8',
            Referrer: 'https://webstatic-sea.mihoyo.com/',
            'x-rpc-language': 'ko-kr',
            'x-rpc-client_type': '4',
            'x-rpc-app_version': '1.5.0',
            'x-rpc-device_id': uuid.v3(authcookie ?? '', uuid.v3.URL).replace('-', ''),
            'x-rpc-show-translated': 'false',
            DS: '',
        }
    });

    instance.interceptors.request.use((config) => {
        config.headers.DS = generateDSToken();
        return config;
    });

    return instance;
}

function createDataMachineHoYoLAB(authcookie) {
    const instance = axios.create({
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.46',
            Cookie: authcookie,
            Accept: 'application/json, text/plain, */*',
            Referrer: 'https://act.hoyolab.com/',
            'Content-Type': 'application/json;charset=utf-8',
            'x-rpc-challenge': uuid.v3(authcookie ?? '', uuid.v3.URL).replace('-', '')
        }
    });

    return instance;
}

async function isDecryptCookie(authcookie) {
    if (typeof authcookie !== 'string'
        || authcookie.trim() === '') {
        return false;
    }

    const authcookie = Buffer.from(authcookie, 'base64');

    const decipherDo = crypto.createDecipheriv(
        process.env.SECRET_ALGORITHM,
        process.env.SECRET_KEY,
        process.env.SECRET_IV
    );

    let decryptedCookie = decipherDo.update(authcookie, 'base64', 'utf8');
    decryptedCookie += decipherDo.final('utf8');

    return decryptedCookie;
}

function isValidCookie(authcookie) {
    if (typeof authcookie !== 'string') return undefined;

    const output = parseCookie(authcookie);
    const requiredFields = ['ltoken', 'ltuid'];

    return requiredFields
        .map((field) => Object.keys(output).includes(field))
        .every((element) => !!element);
}

function parseCookie(authcookie) {
    const output = {};

    authcookie.split(/\s*;\s*/).forEach((pair) => {
        pair = pair.split(/\s*=\s*/);
        output[pair[0]] = pair.splice(1).join('=');
    });

    return output;
}

function generateDSToken() {
    const time = Math.floor(Date.now() * 0.001);
    const DS_SALT = '6cqshh5dhw73bzxn20oexa9k516chk7s';
    const randomChar = generateRandomString(6);
    const dataString = `salt=${DS_SALT}&t=${time}&r=${randomChar}`;
    const hashedData = crypto.createHash('md5').update(dataString).digest('hex');

    return `${time},${randomChar},${hashedData}`;
}

function generateRandomString(len) {
    const charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let str = '';
    for (let i = 0; i < len; i++) {
        str += charSet[Math.floor(Math.random() * charSet.length)]
    }

    return str;
}

module.exports = {
    createMiHoYoDataMachine,
    createDataMachineHoYoLAB,
    isDecryptCookie,
    isValidCookie
};