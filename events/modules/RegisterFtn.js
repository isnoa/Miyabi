const client = require("../../miyabi");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const uuid = require("uuid");
const crypto = require('crypto');
const db = require("../../database/user");
const logger = require("../../events/core/logger");
const { DangerColor } = require("../../database/color");

client.on("interactionCreate", async (interaction) => {
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'setZZZConnectModal') {
            const LtokenInput = interaction.fields.getTextInputValue('zzzConnectLtokenInput')
            const LtuidInput = interaction.fields.getTextInputValue('zzzConnectLtuidInput')
            db.findOne({ user: interaction.user.id }, async (err, userData) => {
                if (err) throw err;
                if (userData) {
                    const cookie = `ltoken=${LtokenInput};` + `ltuid=${LtuidInput};` + ` mi18nLang=${userData.i18n}; _MHYUUID=${uuid.v4()};`
                    // const server = getServer(targetUID);
                    // const Region = getRegion(targetUID);
                    // const cookie = `ltoken=FfzAgAn2yVsFY4DNQk8EE9yV2Zjchkl2cp2oqsPL; ltuid=147312914; mi18nLang=ko-kr; _MHYUUID=${uuid.v4()};`
                    // const encryptedCookie = Object.entries(parseCookie(cookie)).map(([key, value]) => {
                    //     if (['ltuid', 'ltoken', 'account_id', 'cookie_token'].includes(key)) {
                    //         value = '********';
                    //     }
                    //     return `${key}=${value}`;
                    // }).join('; ');
                    // console.log(`[DEBUG] Cookie set: ${encryptedCookie}`);
                    const dataMachine = axios.create({
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
                            'Cookie': cookie,
                            'Accept': 'application/json;charset=utf-8',
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
                    dataMachine.interceptors.response.use((res) => {
                        // console.log(`[DEBUG] DS Header: ${res.config.headers.DS}`);
                        return res;
                    });

                    const profile = await dataMachine.get(`https://bbs-api-os.hoyolab.com/game_record/honkai3rd/api/index?server=kr01&role_id=13360324`).then(res => res.data);
                    if (profile.retcode !== 0) {
                        const embedError = new EmbedBuilder()
                            .setDescription(lang.Register_description_retcodeZero)
                            .setFields(
                                {
                                    name: "캐릭터 HoYoLAB과 연동하는 방법",
                                    value: `[여기](https://www.hoyolab.com/article/5840049)를 클릭해서 알아봐.`,
                                    inline: false
                                },
                                {
                                    name: "HoYoLAB 가입하는 방법",
                                    value: `[여기](https://www.hoyolab.com/article/5840049)를 클릭해서 알아봐.`,
                                    inline: false
                                }
                            )
                            .setColor(DangerColor)
                        // console.log(profile)
                        interaction.reply({ content: `${profile.message}`, embeds: [embedError] })
                        return undefined;

                    }
                    interaction.reply({ content: profile.message })
                    return cookie;

                    function generateDSToken() {
                        const time = Math.floor(Date.now() / 1000);
                        const DS_SALT = '6cqshh5dhw73bzxn20oexa9k516chk7s';
                        const randomChar = randomString(6);
                        const data = `salt=${DS_SALT}&t=${time}&r=${randomChar}`;
                        const hash = crypto.createHash('md5').update(data).digest('hex');
                        return `${time},${randomChar},${hash}`;
                    };

                    function randomString(len = 6, an) {
                        an = an && an.toLowerCase();
                        let str = '';
                        let i = 0;
                        let min = an === 'a' ? 10 : 0;
                        let max = an === 'n' ? 10 : 62;
                        for (; i++ < len;) {
                            let r = Math.random() * (max - min) + min << 0;
                            str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
                        }
                        return str;
                    };
                }


                const algorithm = 'aes-256-cbc';
                const key = 'abcdefghijklmnopqrstuvwxyz123456';
                const iv = '1234567890123456';

                const cipher = crypto.createCipheriv(algorithm, key, iv);
                let encryptedCookie = cipher.update(cookie, 'utf8', 'base64');
                encryptedCookie += cipher.final('base64');
                console.log('암호화:', encryptedCookie);
                userData.updateOne({ $set: { zzzconnect: encryptedCookie } })
                    .catch(err => logger.error(err))
                    .then(interaction.reply({ content: "승인.", ephemeral: true }))
            })
        }
    }
})