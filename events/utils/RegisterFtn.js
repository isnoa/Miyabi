const client = require("../../miyabi.js");
const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder
} = require("discord.js");
const crypto = require('crypto');
const zzz = require("../models/zzz.js");
const text = require("./ko-kr.js");
const { createDataMachine } = require('./dataMachine.js');

let region = "os_asia"

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'RegistrationButton') {
            const zzzAuthModal = new ModalBuilder()
                .setCustomId('setzzzAuthModal')
                .setTitle(text.UISettingzzzAuth)
            const zzzAuthLtokenInput = new TextInputBuilder()
                .setCustomId('zzzAuthLtokenInput')
                .setLabel(`${text.UISettingReqValue}: ltoken`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            const zzzAuthLtuidInput = new TextInputBuilder()
                .setCustomId('zzzAuthLtuidInput')
                .setLabel(`${text.UISettingReqValue}: ltuid`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            const zzzAuthLtokenRow = new ActionRowBuilder().addComponents(zzzAuthLtokenInput)
            const zzzAuthLtuidRow = new ActionRowBuilder().addComponents(zzzAuthLtuidInput)
            zzzAuthModal.addComponents(zzzAuthLtokenRow, zzzAuthLtuidRow)
            await interaction.showModal(zzzAuthModal);
            console.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
        }
    }
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'setzzzAuthModal') {
            const Ltoken = interaction.fields.getTextInputValue('zzzAuthLtokenInput').replace(/\s+/g, '');
            const Ltuid = interaction.fields.getTextInputValue('zzzAuthLtuidInput').replace(/\s+/g, '');
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
            interaction.editReply({ content: profile.message + " 승인.\n" + encryptedCookie, ephemeral: true });

            // function addCookieData(encryptedCookie, uid) {
            //     db.findOne({ userId: interaction.user.id }).then(async (user) => {
            //         if (user) {
            //             db.updateOne({ userId: interaction.user.id }, { $set: { zzzAuth: encryptedCookie, zzzUID: uid, zzzDate: new Date().toISOString().substring(0, 10), dailyCheckIn: false } })
            //                 .catch(err => console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
            //         } else {
            //             new db({ userId: interaction.user.id, zzzAuth: encryptedCookie, zzzUID: uid, zzzDate: new Date().toISOString().substring(0, 10), dailyCheckIn: false })
            //                 .save().catch(err => console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
            //         }
            //     }).catch((err) => {
            //         if (err) throw err;
            //     })
            // }

            function addCookieData(encryptedCookie, uid) {
                zzz.findOne({ where: { user_id: interaction.user.id } })
                    .then((foundData) => {
                        if (foundData) {
                            zzz.update({ is_authorized: true, authcookie: encryptedCookie, srv_uid: uid, srv_reg: region }, { where: { user_id: interaction.user.id } })
                                .catch((error) => {
                                    console.error(`Failed to update zzzData: ${error}`);
                                });
                        } else {
                            zzz.create({ user_id: interaction.user.id, is_authorized: true, authcookie: encryptedCookie, srv_uid: uid, srv_reg: region })
                                .catch((error) => {
                                    console.error(`Failed to update zzzData: ${error}`);
                                });
                        }
                    }).catch(err =>
                        console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`)
                    );
            }
        }
    }
})