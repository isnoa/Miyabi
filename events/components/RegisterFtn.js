const client = require("../../miyabi.js");
const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder,
    // StringSelectMenuBuilder
} = require("discord.js");
const axios = require("axios");
const uuid = require("uuid");
const crypto = require('crypto');
const db = require("../../modules/user.js");
const { DangerColor } = require("../../modules/color.js");
const text = require("../../modules/ko-kr.js");

let region = "os_asia"

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'RegistrationButton') {
            const ZZZConnectModal = new ModalBuilder()
                .setCustomId('setZZZConnectModal')
                .setTitle(text.UISettingZZZConnect)
            // const zzzConnectRegionInput = new StringSelectMenuBuilder()
            //     .setCustomId('zzzConnectRegionInput')
            //     .setMaxValues(1)
            //     .setOptions(
            //         { label: "미국", value: "os_usa" },
            //         { label: "아시아", value: "os_asia" },
            //         { label: "유럽", value: "os_euro" },
            //         { label: "중국", value: "os_cht" },
            //     )
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
            // const zzzConnectRegionRow = new ActionRowBuilder().addComponents(zzzConnectRegionInput)
            const zzzConnectLtokenRow = new ActionRowBuilder().addComponents(zzzConnectLtokenInput)
            const zzzConnectLtuidRow = new ActionRowBuilder().addComponents(zzzConnectLtuidInput)
            // ZZZConnectModal.addComponents(zzzConnectRegionRow, zzzConnectLtokenRow, zzzConnectLtuidRow)
            ZZZConnectModal.addComponents(zzzConnectLtokenRow, zzzConnectLtuidRow)
            await interaction.showModal(ZZZConnectModal);
            console.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
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
                console.log(`[DEBUG] DS Header: ${res.config.headers.DS}`);
                return res;
            });


            const profile = await dataMachine.get(`https://api-os-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?=hk4e_global&region=${region}`).then(res => res.data);
            if (profile.retcode !== 0) {
                const embedError = new EmbedBuilder()
                    .setDescription(text.UIRetcodeZero + "\n에러 내용: " + `\`${profile.message}\``)
                    .setFields(
                        {
                            name: "해결 방법 [1]",
                            value: `[[이동]](https://www.hoyolab.com/article/5840049) 해결 가이드를 통해 알아보는 방법이 있어.`,
                            inline: false
                        },
                        {
                            name: "해결 방법 [2]",
                            value: `[[이동]](://discord) 개발자에게 물어보는 방법이 있어.`,
                            inline: false
                        },
                    )
                    .setColor(DangerColor)
                interaction.editReply({ embeds: [embedError], ephemeral: true })
                return undefined;
            }

            const algorithm = process.env.SECRET_ALGORITHM;
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
            console.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);

            function addCookieData(encryptedCookie, uid) {
                db.findOne({ userId: interaction.user.id }).then(async (user) => {
                    if (user) {
                        db.updateOne({ userId: interaction.user.id }, { $set: { zzzConnect: encryptedCookie, zzzUID: uid, zzzDate: new Date().toISOString().substring(0, 10), zzzLevel: 99, dailyCheckIn: false } })
                            .catch(err => console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
                    } else {
                        new db({ userId: interaction.user.id, zzzConnect: encryptedCookie, zzzUID: uid, zzzDate: new Date().toISOString().substring(0, 10), zzzLevel: 99, dailyCheckIn: false })
                            .save().catch(err => console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
                    }
                }).catch((err) => {
                    if (err) throw err;
                })
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
        }
    }
})