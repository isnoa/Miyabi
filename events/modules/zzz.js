const axios = require("axios");
const uuid = require("uuid");
const crypto = require('crypto');

class ZZZ {
    constructor(options) {
        const { cookie, lang } = options;

        if (!["ltoken", "ltuid"].every(cookieKey => cookie.includes(cookieKey))) {
            throw new Error("The cookie value is missing the required key value ltoken or ltuid.");
        }

        this.accountID = this.#getLtuidFromCookie(cookie);

        this.linksList = {
            getGameRecordCardString: "https://bbs-api-os.hoyolab.com/game_record/card/wapi/getGameRecordCard",
            getUserFullInfoString: "https://bbs-api-os.hoyolab.com/community/user/wapi/getUserFullInfo",
            getUserGameRolesByCookieString: "https://api-os-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie"
        }

        this.dataMachine = axios.create({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.46',
                Cookie: cookie,
                Accept: 'application/json;charset=utf-8',
                Referrer: 'https://webstatic-sea.mihoyo.com/',
                'x-rpc-language': lang,
                'x-rpc-client_type': '4',
                'x-rpc-app_version': '1.5.0',
                'x-rpc-device_id': uuid.v3(cookie ?? '', uuid.v3.URL).replace('-', ''),
                'x-rpc-show-translated': 'false',
                DS: '',
            }
        });

        this.dataMachine.interceptors.request.use((config) => {
            config.headers.DS = this.#generateDSToken();
            return config;
        });
    }

    #getLtuidFromCookie(cookie) {
        const regex = /ltuid=(\d{9});/;
        const match = cookie.match(regex);
        if (match && match.length > 1) {
            return match[1];
        } else {
            throw new Error("ltuid value is missing or invalid in the cookie.");
        }
    }


    #generateDSToken() {
        const time = Math.floor(Date.now() * 0.001);
        const DS_SALT = '6cqshh5dhw73bzxn20oexa9k516chk7s';
        const randomChar = this.#generateRandomString(6);
        const dataString = `salt=${DS_SALT}&t=${time}&r=${randomChar}`;
        const hashedData = crypto.createHash('md5').update(dataString).digest('hex');
        return `${time},${randomChar},${hashedData}`;
    }

    #generateRandomString(len) {
        const charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let str = '';
        for (let i = 0; i < len; i++) {
            str += charSet[Math.floor(Math.random() * charSet.length)];
        }
        return str;
    }

    get #getLinks() {
        return this.linksList;
    }

    getGameRecordCard() {
        const result = this.dataMachine
            .get(`${this.#getLinks.getGameRecordCardString}?uid=${this.accountID}`)
            .then(res => {
                const list = res.data.data.list;
                let targetProfile = null;
                for (let i = 0; i < list.length; i++) {
                    if (list[i].game_id === 6) {
                        targetProfile = list[i];
                        break;
                    }
                }
                if (targetProfile === null) {
                    throw new Error("No information related to Zenless Zone Zero could be found in this user's GameRecord.");
                }
                return targetProfile;
            })
            .catch(err => { throw new Error(err) });
        return result;
    }

    getUserFullInfo() {
        const result = this.dataMachine
            .get(this.#getLinks.getUserFullInfoString)
            .then(res => res.data.data.user_info);
        return result;
    }

    getUserGameRolesByCookie() {
        const result = this.dataMachine
            .get(this.#getLinks.getUserGameRolesByCookieString)
            .then(res => res.data.data);
        return result;
    }
}

module.exports = ZZZ;