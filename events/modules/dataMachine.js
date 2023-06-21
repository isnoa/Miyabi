const axios = require("axios");
const uuid = require("uuid");
const crypto = require('crypto');

function createDataMachine(cookie) {
    const dataMachine = axios.create({
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
            Cookie: cookie,
            Accept: 'application/json;charset=utf-8',
            Referrer: 'https://webstatic-sea.mihoyo.com/',
            'x-rpc-language': 'ko-kr',
            'x-rpc-client_type': '4',
            'x-rpc-app_version': '1.5.0',
            'x-rpc-device_id': uuid.v3(cookie ?? '', uuid.v3.URL).replace('-', ''),
            'x-rpc-show-translated': 'false',
            DS: '',
        }
    });

    dataMachine.interceptors.request.use((config) => {
        config.headers.DS = generateDSToken();
        return config;
    });

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

    return dataMachine;
}

module.exports = { createDataMachine };