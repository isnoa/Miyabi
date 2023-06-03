const client = require("../../miyabi.js");
const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    // StringSelectMenuBuilder
    TextInputStyle,
    EmbedBuilder
} = require("discord.js");
const axios = require("axios");
const uuid = require("uuid");
const crypto = require('crypto');
const db = require("../../events/core/user.js");
const text = require("../../events/modules/ko-kr.js");

let region = "os_asia"

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'OverviewButton') {
            const Embed = new EmbedBuilder()
                .setDescription([
                    "**흠? 가입을 하고 싶다고? 좋아, 그럼 설명을 잘 읽어봐.**",
                    "**디바이스에 맞게 영상을 시청 후, 값들을 알맞게 입력해서 주면 돼.**",
                    "**만약에 궁금한 게 생기면 아래에 링크된 서포터 서버로 가서 문의하도록 해.**",
                ].join('\n'))
                .setColor(text.UIColourMiyabi)
            interaction.update({ embeds: [Embed] })
        }

        if (interaction.customId === 'QnAButton') {
            const Embed = new EmbedBuilder()
                .setTitle("쿠키에 관한 QnA")
                .setDescription([
                    "> **음? 쿠키에 대해 알고 싶다고? 마침 나한테 쿠키 사용법에 대한 서류가 있는데 끝까지 다 읽어보는 게 좋을 거야.**\n",
                    "**```\n1. 쿠키란 무엇인가요?\n```** **쿠키란 웹사이트 접속 시 로프꾼(사용자)의 디바이스와 웹사이트 이용 정보를 수집 및 저장되는 것입니다.**\n",
                    "**```\n2. Miyabi는 제 쿠키를 필요로 하는 이유가 무엇인가요?\n```** **Miyabi는 HoYoLAB을 통해 연동(게임 내 정보 불러오기), 자동 출석 체크 같은 간편 기능을 제공하기 위함입니다.**\n",
                    "**```\n3. 제 쿠키를 악용할 수도 있지 않나요?\n```** **로프꾼 분들이 조금이라도 더 안전하고 편하시도록 최소한의 정보만 수집하는 방식을 선호하고 있으며, Miyabi에게 쿠키값을 줄지는 여러분들의 믿음에 따라 다르겠지만, 개발에 수 백시간을 넘게 들였으며, 쿠키로 뭔가 딱히 할 게 없습니다. 이익을 위해 쿠키값을 넘기거나 발설하거나 사적으로, 테스트로 등의 이유로 사용하지 않으며, 정보 확인 외엔 일절 사용되지 않으며 정보를 확인할 수 있는 사람은 개발자 한 명뿐입니다.**\n",
                    "**```\n가입 이후에 계정이 해킹 당하시거나 계정과 관련한 무언가 문제가 발생하는 경우는 불법 프로그램, 레지스트리(클라이언트 변조), 개인 디바이스의 보안 이슈 등으로 인한 것이며, Miyabi와 아무런 관련이 없으며, 책임이 없는 점을 안내해 드립니다.\n```**"
                ].join('\n'))
                .setColor(text.UIColourMiyabi)
                .setFooter({ text: "MIYABI: ... 잠만 이거 내 뒷담화 아니지?" })
            interaction.update({ embeds: [Embed] })
        }

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
            const Ltoken = interaction.fields.getTextInputValue('zzzConnectLtokenInput').replace(/\s+/g, '');
            const Ltuid = interaction.fields.getTextInputValue('zzzConnectLtuidInput').replace(/\s+/g, '');
            const cookie = `ltoken=${Ltoken}; ltuid=${Ltuid};`;
            await interaction.deferReply();
            
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

            const profile = await dataMachine.get(`https://api-os-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_global&region=${region}`).then(res => res.data);
            if (profile.retcode !== 0) {
                const Embed = new EmbedBuilder()
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
                    .setColor(text.UIColourDanger)
                interaction.editReply({ embeds: [Embed], ephemeral: true })
                return undefined;
            }

            const algorithm = process.env.SECRET_ALGORITHM;
            const key = process.env.SECRET_KEY;
            const iv = process.env.SECRET_VI;

            const cipher = crypto.createCipheriv(algorithm, key, iv);
            let encryptedCookie = cipher.update(cookie, 'utf8', 'base64');
            encryptedCookie += cipher.final('base64');

            /****복호화 */
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