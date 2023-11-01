const client = require("../../miyabi");
const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder
} = require("discord.js");
const crypto = require('node:crypto');
const axios = require("axios");
const user = require("../../models/user");
const zzz = require("../../models/zzz");
const text = require("./TextMap.json");
const { createMiHoYoDataMachine } = require('./dataMachine');

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'AuthButton') {
            const zzzAuthModal = new ModalBuilder()
                .setCustomId('zzzAuthModal')
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
        if (interaction.customId === 'zzzAuthModal') {
            const Ltoken = interaction.fields.getTextInputValue('zzzAuthLtokenInput').replace(/\s+/g, '');
            const Ltuid = interaction.fields.getTextInputValue('zzzAuthLtuidInput').replace(/\s+/g, '');
            const cookie = `ltoken=${Ltoken}; ltuid=${Ltuid};`;
            await interaction.deferReply();

            const dataMachine = createMiHoYoDataMachine(cookie);

            const hoyolabPromise = await dataMachine.get(`https://bbs-api-os.hoyolab.com/community/painter/wapi/user/full?uid=${Ltuid}`).then(res => res.data);
            const ingamePromise = await dataMachine.get('https://api-os-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_global').then(res => res.data);

            axios.all([hoyolabPromise, ingamePromise])
                .then(axios.spread((hoyolabRes, ingameRes) => {
                    if (hoyolabRes.retcode !== 0) {

                    }
                    if (ingameRes.retcode !== 0) {

                    }

                    const Embed = new EmbedBuilder()
                        .setAuthor({ name: hoyolabRes.data.user_info.nickname })
                        .setDescription(`- ${hoyolabRes.data.user_info.introduce || "자기 소개 없음"}\n**${hoyolabRes.data.user_info.achieve.post_num || "0"}**게시물 / **${hoyolabRes.data.user_info.achieve.follow_cnt || "0"}**팔로우 / **${hoyolabRes.data.user_info.achieve.followed_cnt || "0"}**팔로워 / **${hoyolabRes.data.user_info.achieve.like_num_unit || "0"}**좋아요`)
                        .addFields(
                            { name: "UID", value: hoyolabRes.data.user_info.uid, inline: true },
                            { name: "성별", value: hoyolabRes.data.user_info.gender || text.UNKNOWN, inline: true },
                            { name: "레벨", value: hoyolabRes.data.user_info.level.level_desc, inline: true }
                        )
                        .setThumbnail(hoyolabRes.data.user_info.avatar_url)
                        .setImage(hoyolabRes.data.user_info.pc_bg_url)
                        .setColor(hoyolabRes.data.user_info.level.bg_color)

                    return interaction.editReply({ embeds: [Embed], ephemeral: true });
                }))
                .catch(err => {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.SRC_ISSUE).setColor(text.MIYABI_COLOR)], components: [] })
                    throw err;
                });

            // const profile = await dataMachine.get(`https://api-os-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_global&region=os_asia`).then(res => res.data);
            // if (profile.retcode !== 0) {
            //     const Embed = new EmbedBuilder()
            //         .setDescription(text.RETCODE_ZERO + "\n에러 내용: " + `\`${profile.message}\``)
            //         .addFields(
            //             {
            //                 name: "해결 방법 [1]",
            //                 value: `게임에 들어가서 프로필을 생성해.`,
            //                 inline: true
            //             },
            //             {
            //                 name: "해결 방법 [2]",
            //                 value: `쿠키 정보를 다시 정확하게 입력해.`,
            //                 inline: true
            //             },
            //             {
            //                 name: "해결 방법 [3]",
            //                 value: `HoYoLAB을 로그아웃 후 로그인하고 쿠키 정보를 다시 입력해.`,
            //                 inline: true
            //             },
            //         )
            //         .setColor(text.DANGER_COLOR)
            //     interaction.editReply({ embeds: [Embed], ephemeral: true })
            //     return undefined;
            // }

            // const algorithm = process.env.SECRET_ALGORITHM;
            // const key = process.env.SECRET_KEY;
            // const iv = process.env.SECRET_IV;

            // const cipher = crypto.createCipheriv(algorithm, key, iv);
            // let encryptedCookie = cipher.update(cookie, 'utf8', 'base64');
            // encryptedCookie += cipher.final('base64');

            // /** 복호화 */
            // // const decipher = crypto.createDecipheriv(algorithm, key, iv);
            // // let result = decipher.update(encryptedCookie, 'base64', 'utf8');
            // // result += decipher.final('utf8');

            // const uid = profile.data.list[0].game_uid

            // addCookieData(encryptedCookie, uid);
            // const Embed = new EmbedBuilder()
            //     .setTitle("등록 완료")
            //     .setDescription(profile.message)
            // interaction.editReply({ embeds: [Embed], ephemeral: true });

            function addCookieData(encryptedCookie, uid) {
                Promise.all([
                    user.findOne({ where: { user_id: interaction.user.id } }),
                    zzz.findOne({ where: { user_id: interaction.user.id } })
                ]).then(([userData, zzzData]) => {
                    if (userData) {
                        if (userData.is_show_uid) {
                            user.update({ is_show_uid: true }, { where: { user_id: interaction.user.id } });
                        }
                        if (userData.is_show_profile) {
                            user.update({ is_show_profile: true }, { where: { user_id: interaction.user.id } });
                        }
                    } else {
                        user.create({ user_id: interaction.user.id, is_show_uid: true, is_show_profile: true })
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