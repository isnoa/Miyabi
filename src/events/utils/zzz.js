const axios = require("axios");
const uuid = require("uuid");
const crypto = require('crypto');

class ZZZ {
    constructor(options) {
        const { cookie, language } = options;

        if (!["ltoken", "ltuid"].every(cKey => cookie.includes(cKey))) {
            throw new Error("The cookie value is missing the required key value ltoken or ltuid.");
        }

        this.accountID = this.#getLtuidFromCookie(cookie);

        this.urlList = {
            getGameRecordCardString: "https://bbs-api-os.hoyolab.com/game_record/card/wapi/getGameRecordCard",
            getUserFullInfoString: "https://bbs-api-os.hoyolab.com/community/user/wapi/getUserFullInfo",
            getUserGameRolesByCookieString: "https://api-os-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie"
        }

        this.createMachine = {
            "HoYoLABInstance": axios.create({
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.46',
                    Cookie: cookie,
                    Accept: 'application/json, text/plain, */*',
                    Referrer: 'https://act.hoyolab.com/',
                    'Content-Type': 'application/json;charset=utf-8',
                    'x-rpc-challenge': uuid.v3(cookie ?? '', uuid.v3.URL).replace('-', ''),
                }
            }),
            "MiHoYoInstance": axios.create({
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.46',
                    Cookie: cookie,
                    Accept: 'application/json;charset=utf-8',
                    Referrer: 'https://webstatic-sea.mihoyo.com/',
                    'x-rpc-language': language,
                    'x-rpc-client_type': '4',
                    'x-rpc-app_version': '1.5.0',
                    'x-rpc-device_id': uuid.v3(cookie ?? '', uuid.v3.URL).replace('-', ''),
                    'x-rpc-show-translated': 'false',
                    DS: '',
                }
            })
        }

        this.createMachine.MiHoYoInstance.interceptors.request.use((config) => {
            config.headers.DS = this.#generateDSToken();
            return config;
        });
    }

    get getLinks() {
        return this.urlList;
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



    getGameRecordCard() {
        const result = this.createMachine.MiHoYoInstance
            .get(`${this.getLinks.getGameRecordCardString}?uid=${this.accountID}`)
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
        const result = this.createMachine.MiHoYoInstance
            .get(this.getLinks.getUserFullInfoString)
            .then(res => res.data.data.user_info);
        return result;
    }

    getUserGameRolesByCookie() {
        const result = this.createMachine.MiHoYoInstance
            .get(this.getLinks.getUserGameRolesByCookieString)
            .then(res => res.data.data);
        return result;
    }

    /**
     * 
     * @param {string} uid 
     * @description Recognizes which server a UID is from.
     * @returns 
     */
    recognize_server(uid) {
        if (typeof (uid) === 'string') {
            return 'UID type must be a string.';
        }
        const server = {
            "1": "cn_gf01",
            "2": "cn_gf01",
            "5": "cn_qd01",
            "6": "os_usa",
            "7": "os_euro",
            "8": "os_asia",
            "9": "os_cht",
        }[String(uid)[0]];

        if (!server) {
            return {
                "name": "AccountNotFound",
                "reason": `UID ${uid} isn't associated with any server`
            };
        } else if (['cn_gf01', 'cn_qd01'].includes(server)) {
            return {
                "name": "ServerUnSupported",
                "reason": 'This account is using an unsupported server.'
            };
        } else {
            return server;
        }
    }
}


class AccountNotFound extends Error {
    constructor(uid) {
        super(`UID ${uid} isn't associated with any server`);
        this.name = "AccountNotFound";
    }
}

module.exports = ZZZ;