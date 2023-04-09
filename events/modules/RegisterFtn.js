const client = require("../../miyabi.js");
const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder
} = require("discord.js");
const axios = require("axios");
const uuid = require("uuid");
const crypto = require('crypto');
const db = require("../../database/user.js");
const logger = require("../../events/core/logger.js");
const { DangerColor } = require("../../database/color.js");
const text = require("../../database/ko-kr.js");

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'RegistrationButton') {
            const ZZZConnectModal = new ModalBuilder()
                .setCustomId('setZZZConnectModal')
                .setTitle(text.UISettingZZZConnect)
            const zzzConnectLtokenInput = new TextInputBuilder()
                .setCustomId('zzzConnectLtokenInput')
                .setLabel(`${text.UISettingREQValue}: ltoken`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            const zzzConnectLtuidInput = new TextInputBuilder()
                .setCustomId('zzzConnectLtuidInput')
                .setLabel(`${text.UISettingREQValue}: ltuid`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            const zzzConnectLtokenRow = new ActionRowBuilder().addComponents(zzzConnectLtokenInput)
            const zzzConnectLtuidRow = new ActionRowBuilder().addComponents(zzzConnectLtuidInput)
            ZZZConnectModal.addComponents(zzzConnectLtokenRow, zzzConnectLtuidRow)
            await interaction.showModal(ZZZConnectModal);
            logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
        }
    }
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'setZZZConnectModal') {
            const Ltoken = interaction.fields.getTextInputValue('zzzConnectLtokenInput').replace(/\s+/g, '')
            const Ltuid = interaction.fields.getTextInputValue('zzzConnectLtuidInput').replace(/\s+/g, '')
            await interaction.deferReply();

            const cookie = `ltoken=${Ltoken}; ltuid=${Ltuid}; mi18nLang=ko-kr; _MHYUUID=${uuid.v4()};`;

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


            const profile = await dataMachine.get(`https://api-os-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=bh3_global`).then(res => res.data);
            if (profile.retcode !== 0) {
                const embedError = new EmbedBuilder()
                    .setDescription(text.UIRetcodeZero)
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
                interaction.editReply({ content: `${profile.message}`, embeds: [embedError], ephemeral: true })
                return undefined;
            }

            const algorithm = process.env.ALGORITHM;
            const key = process.env.SECRET_KEY;
            const iv = process.env.SECRET_VI;

            const cipher = crypto.createCipheriv(algorithm, key, iv);
            let encryptedCookie = cipher.update(cookie, 'utf8', 'base64');
            encryptedCookie += cipher.final('base64');

            /** 복호화 */
            // const decipher = crypto.createDecipheriv(algorithm, key, iv);
            // let result2 = decipher.update(encryptedCookie, 'base64', 'utf8');
            // result2 += decipher.final('utf8');
            
            const uid = profile.data.list[0].game_uid

            addCookieData(encryptedCookie, uid)
            interaction.editReply({ content: profile.message + " 승인.", ephemeral: true });
            logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);

            function addCookieData(encryptedCookie, uid) {
                db.findOne({ user: interaction.user.id }).then(async (user) => {
                    if (user) {
                        db.updateOne({ user: interaction.user.id }, { $set: { zzzconnect: encryptedCookie, uid: uid, zzzdate: new Date().toISOString().substring(0, 10), zzzlevel: 99, dailycheckin: false } })
                            .catch(err => logger.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
                    } else {
                        new db({ timestamp: new Date().getTime(), user: interaction.user.id, zzzconnect: encryptedCookie, uid: uid, zzzdate: new Date().toISOString().substring(0, 10), zzzlevel: 99, dailycheckin: false })
                            .save().catch(err => logger.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
                    }
                }).catch((err) => {
                    if (err) throw err;
                })
            }

            function generateDSToken() {
                const time = Math.floor(Date.now() / 1000);
                const DS_SALT = '6cqshh5dhw73bzxn20oexa9k516chk7s';
                const randomChar = randomString(6);
                const data = `salt=${DS_SALT}&t=${time}&r=${randomChar}`;
                const hash = crypto.createHash('md5').update(data).digest('hex');
                return `${time},${randomChar},${hash}`;
            }

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
            }
        }
    }
})