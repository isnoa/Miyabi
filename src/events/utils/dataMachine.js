const axios = require("axios");
const uuid = require("uuid");
const crypto = require('crypto');

function createMiHoYoDataMachine(cookie) {
    const instance = axios.create({
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.46',
            Cookie: cookie,
            Accept: 'application/json;charset=utf-8',
            Referrer: 'https://webstatic-sea.mihoyo.com/',
            'x-rpc-language': 'TextMap.json',
            'x-rpc-client_type': '4',
            'x-rpc-app_version': '1.5.0',
            'x-rpc-device_id': uuid.v3(cookie ?? '', uuid.v3.URL).replace('-', ''),
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

function createActHoYoLABDataMachine(cookie) {
    const instance = axios.create({
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.46',
            Cookie: cookie,
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=utf-8',
            Referrer: 'https://act.hoyolab.com/',
            'x-rpc-challenge': uuid.v3(cookie ?? '', uuid.v3.URL).replace('-', '')
        }
    });

    return instance;
}

async function getUserGameInfoMachine(cookie, region) {
    if (!isValidCookie(cookie)) {
        const decryptedCookie = decryptCookie(cookie);

        const instance = await createMiHoYoDataMachine(decryptedCookie)
            .get(`https://api-os-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_global&region=${region}`);

        const userInfo = instance.data.data.list[0];

        return userInfo;
    }
}

function isValidCookie(cookie) {
    if (typeof cookie !== 'string') return undefined;
    
    const output = parseCookie(cookie);
    const requiredFields = ['ltuid', 'ltoken'];

    return requiredFields
        .map((field) => Object.keys(output).includes(field))
        .every((element) => !!element);
}

function parseCookie(cookie) {
    const output = {};

    cookie.split(/\s*;\s*/).forEach((pair) => {
        pair = pair.split(/\s*=\s*/);
        output[pair[0]] = pair.splice(1).join('=');
    });

    return output;
}

function decryptCookie(cookie) {
    const algorithm = process.env.SECRET_ALGORITHM;
    const key = process.env.SECRET_KEY;
    const iv = process.env.SECRET_IV;

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decryptedCookie = decipher.update(cookie, 'base64', 'utf8');
    decryptedCookie += decipher.final('utf8');

    return decryptedCookie;
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
    createActHoYoLABDataMachine,
    getUserGameInfoMachine
};