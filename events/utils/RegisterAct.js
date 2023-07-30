const client = require("../../miyabi");
const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder
} = require("discord.js");
const crypto = require('node:crypto');
const user = require("../models/user");
const zzz = require("../models/zzz");
const text = require("./TextMap");
const { createMiHoYoDataMachine } = require('./dataMachine.js');

let region = "os_asia"

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'RegistrationButton') {
            const zzzAuthModal = new ModalBuilder()
                .setCustomId('setzzzAuthModal')
                .setTitle(text.SETTING_ZZZ_AUTH)
            const zzzAuthLtokenInput = new TextInputBuilder()
                .setCustomId('zzzAuthLtokenInput')
                .setLabel(`${text.SETTING_REQUIRED_VALUE}: ltoken`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            const zzzAuthLtuidInput = new TextInputBuilder()
                .setCustomId('zzzAuthLtuidInput')
                .setLabel(`${text.SETTING_REQUIRED_VALUE}: ltuid`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            const zzzAuthLtokenRow = new ActionRowBuilder().addComponents(zzzAuthLtokenInput)
            const zzzAuthLtuidRow = new ActionRowBuilder().addComponents(zzzAuthLtuidInput)
            zzzAuthModal.addComponents(zzzAuthLtokenRow, zzzAuthLtuidRow)
            await interaction.showModal(zzzAuthModal);

        }
    }
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'setzzzAuthModal') {
            const Ltoken = interaction.fields.getTextInputValue('zzzAuthLtokenInput').replace(/\s+/g, '');
            const Ltuid = interaction.fields.getTextInputValue('zzzAuthLtuidInput').replace(/\s+/g, '');
            const cookie = `ltoken=${Ltoken}; ltuid=${Ltuid};`;
            await interaction.deferReply();

            const dataMachine = createMiHoYoDataMachine(cookie);

            const profile = await dataMachine.get(`https://api-os-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_global&region=${region}`).then(res => res.data);
            if (profile.retcode !== 0) {
                const Embed = new EmbedBuilder()
                    .setDescription(text.RETCODE_ZERO + "\n에러 내용: " + `\`${profile.message}\``)
                    .setFields(
                        {
                            name: "해결 방법 [1]",
                            value: `[[이동]](https://www.hoyolab.com/article/5840049) 해결 가이드를 통해 알아보는 방법이 있어.`,
                            inline: true
                        },
                        {
                            name: "해결 방법 [2]",
                            value: `[[이동]](://discord) 개발자에게 물어보는 방법이 있어.`,
                            inline: true
                        },
                    )
                    .setColor(text.DANGER_COLOR)
                interaction.editReply({ embeds: [Embed], ephemeral: true })
                return undefined;
            }

            const algorithm = process.env.SECRET_ALGORITHM;
            const key = process.env.SECRET_KEY;
            const iv = process.env.SECRET_IV;

            const cipher = crypto.createCipheriv(algorithm, key, iv);
            let encryptedCookie = cipher.update(cookie, 'utf8', 'base64');
            encryptedCookie += cipher.final('base64');

            /** 복호화 */
            // const decipher = crypto.createDecipheriv(algorithm, key, iv);
            // let result = decipher.update(encryptedCookie, 'base64', 'utf8');
            // result += decipher.final('utf8');

            const uid = profile.data.list[0].game_uid

            addCookieData(encryptedCookie, uid);
            interaction.editReply({ content: profile.message + " 승인.\n" + encryptedCookie, ephemeral: true });

            function addCookieData(encryptedCookie, uid) {
                Promise.all([
                    user.findOne({ where: { user_id: interaction.user.id } }),
                    zzz.findOne({ where: { user_id: interaction.user.id } })
                ]).then(([userData, zzzData]) => {
                    if (userData) {
                        if (userData.is_hide_uid === null) {
                            user.update({ is_hide_uid: true }, { where: { user_id: interaction.user.id } });
                        }
                        if (userData.is_hide_profile === null) {
                            user.update({ is_hide_profile: true }, { where: { user_id: interaction.user.id } });
                        }
                    } else {
                        user.create({ user_id: interaction.user.id, is_hide_uid: true, is_hide_profile: true })
                    }

                    if (zzzData) {
                        zzz.update({ is_authorized: true, authcookie: encryptedCookie, srv_uid: uid }, { where: { user_id: interaction.user.id } })
                    } else {
                        zzz.create({ user_id: interaction.user.id, is_authorized: true, authcookie: encryptedCookie, srv_uid: uid })
                    }
                }).catch(err => {
                    interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.SRC_ISSUE).setColor(text.MIYABI_COLOR)], components: [] })
                });
            }
        }
    }
})