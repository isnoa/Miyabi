const client = require("../../miyabi.js");
const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    // StringSelectMenuBuilder
    TextInputStyle,
    EmbedBuilder
} = require("discord.js");
const crypto = require('crypto');
const db = require("../../events/modules/user.js");
const text = require("../../events/modules/ko-kr.js");
const { createDataMachine } = require('./dataMachine.js');

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
                .setLabel(`${text.UISettingReqValue}: ltoken`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            const zzzConnectLtuidInput = new TextInputBuilder()
                .setCustomId('zzzConnectLtuidInput')
                .setLabel(`${text.UISettingReqValue}: ltuid`)
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

            const dataMachine = createDataMachine(cookie);

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
            const iv = process.env.SECRET_IV;

            const cipher = crypto.createCipheriv(algorithm, key, iv);
            let encryptedCookie = cipher.update(cookie, 'utf8', 'base64');
            encryptedCookie += cipher.final('base64');

            /****복호화 */
            // const decipher = crypto.createDecipheriv(algorithm, key, iv);
            // let result = decipher.update(encryptedCookie, 'base64', 'utf8');
            // result += decipher.final('utf8');

            const uid = profile.data.list[0].game_uid

            addCookieData(encryptedCookie, uid)
            interaction.editReply({ content: profile.message + " 승인.", ephemeral: true });
            console.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);

            function addCookieData(encryptedCookie, uid) {
                db.findOne({ userId: interaction.user.id }).then(async (user) => {
                    if (user) {
                        db.updateOne({ userId: interaction.user.id }, { $set: { zzzConnect: encryptedCookie, zzzUID: uid, zzzDate: new Date().toISOString().substring(0, 10), dailyCheckIn: false } })
                            .catch(err => console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
                    } else {
                        new db({ userId: interaction.user.id, zzzConnect: encryptedCookie, zzzUID: uid, zzzDate: new Date().toISOString().substring(0, 10), dailyCheckIn: false })
                            .save().catch(err => console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
                    }
                }).catch((err) => {
                    if (err) throw err;
                })
            }
        }
    }
})