const client = require("../../miyabi");
const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ButtonBuilder,
    ButtonStyle,
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
            const AuthModal = new ModalBuilder()
                .setCustomId('AuthModal')
                .setTitle(text.SETTING_AUTH_TITLE)
            const AuthLtokenInput = new TextInputBuilder()
                .setCustomId('AuthLtokenInput')
                .setLabel(`${text.SETTING_REQUIRED_VALUE}: ltoken`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            const AuthLtuidInput = new TextInputBuilder()
                .setCustomId('AuthLtuidInput')
                .setLabel(`${text.SETTING_REQUIRED_VALUE}: ltuid`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            const AuthLtokenRow = new ActionRowBuilder().addComponents(AuthLtokenInput)
            const AuthLtuidRow = new ActionRowBuilder().addComponents(AuthLtuidInput)
            AuthModal.addComponents(AuthLtokenRow, AuthLtuidRow)
            await interaction.showModal(AuthModal);
        }

        if (interaction.customId === 'AuthYesButton') {

        } else if (interaction.customId === 'AuthNoButton') {
            interaction.update({ content: "음, 아니야? 기록은 없애는 걸로 할게, 검술 수련도 있으니 용건이 없으면 돌아가도록 할게.", embeds: [], components: [] })
            await waitFor(3000);

            return interaction.deleteReply();
        } else if (interaction.customId === 'AuthCancelButton') {
            interaction.update({ content: "음, 취소? 그래, 그러도록 할게. 회의와 보고서 제출이 겹쳐서 바쁘니 용건이 없으면 돌아가도록 할게.", embeds: [], components: [] })

            await waitFor(3000);
            return interaction.deleteReply();
        }

        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'AuthModal') {
                const ltoken = interaction.fields.getTextInputValue('AuthLtokenInput').replace(/\s+/g, '');
                const ltuid = interaction.fields.getTextInputValue('AuthLtuidInput').replace(/\s+/g, '');
                const cookie = `ltoken=${ltoken}; ltuid=${ltuid};`;

                const dataMachine = createMiHoYoDataMachine(cookie);

                const hoyolabPromise = await dataMachine.get(`https://bbs-api-os.hoyolab.com/community/painter/wapi/user/full?uid=${ltuid}`).then(res => res.data);
                const ingamePromise = await dataMachine.get('https://api-os-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_global').then(res => res.data);

                axios.all([hoyolabPromise, ingamePromise])
                    .then(axios.spread((hoyolabRes, ingameRes) => {
                        if (hoyolabRes.retcode !== 0) {
                            const Embed = new EmbedBuilder()
                                .setDescription("쿠키 정보를 다시 정확하게 입력하거나 HoYoLAB을 다시 로그인하고 쿠키 정보를 입력해.")
                                .setColor(text.DANGER_COLOR)

                            return interaction.update({ embeds: [Embed], ephemeral: true })
                        }
                        if (ingameRes.retcode !== 0) {
                            const Embed = new EmbedBuilder()
                                .setDescription("게임에 접속해서 프로필을 생성해.")
                                .setColor(text.DANGER_COLOR)

                            return interaction.update({ embeds: [Embed], ephemeral: true })
                        }

                        const Embed = new EmbedBuilder()
                            .setAuthor({ name: `'${hoyolabRes.data.user_info.nickname}'이(가) 네 계정이 맞아?` })
                            .setDescription(`- ${hoyolabRes.data.user_info.introduce || "자기 소개 없음"}\n**${hoyolabRes.data.user_info.achieve.post_num || "0"}** 게시물 / **${hoyolabRes.data.user_info.achieve.follow_cnt || "0"}** 팔로우 / **${hoyolabRes.data.user_info.achieve.followed_cnt || "0"}** 팔로워 / **${hoyolabRes.data.user_info.achieve.like_num_unit || "0"}** 좋아요`)
                            .addFields(
                                { name: "UID", value: hoyolabRes.data.user_info.uid, inline: true },
                                { name: "성별", value: hoyolabRes.data.user_info.gender || text.UNKNOWN, inline: true },
                                { name: "레벨", value: hoyolabRes.data.user_info.level.level_desc, inline: true }
                            )
                            .setThumbnail(hoyolabRes.data.user_info.avatar_url)
                            .setImage(hoyolabRes.data.user_info.pc_bg_url)
                            .setColor(hoyolabRes.data.user_info.level.bg_color)

                        const Row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('AuthYesButton')
                                    .setLabel("맞아.")
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setCustomId('AuthNoButton')
                                    .setLabel("아니.")
                                    .setStyle(ButtonStyle.Danger),
                                new ButtonBuilder()
                                    .setCustomId('AuthCancelButton')
                                    .setLabel("(취소하기)")
                                    .setStyle(ButtonStyle.Secondary)
                            )

                        return interaction.update({ embeds: [Embed], components: [Row], ephemeral: true });
                    }))
                    .catch(err => {
                        interaction.update({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.SRC_ISSUE).setColor(text.MIYABI_COLOR)], components: [] })
                        throw err;
                    });

                // const profile = await dataMachine.get(`https://api-os-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_global&region=os_asia`).then(res => res.data);
                // if (profile.retcode !== 0) {
                //     const Embed = new EmbedBuilder()
                //         .setDescription(text.RETCODE_ZERO + "\n에러 내용: " + `\`${profile.message}\``)
                //         .addFields(
                //             {
                //                 name: "해결 방법 [1]",
                //                 value: `게임에 접속해서 프로필을 생성해.`,
                //                 inline: true
                //             },
                //             {
                //                 name: "해결 방법 [2]",
                //                 value: `쿠키 정보를 다시 정확하게 입력하거나 HoYoLAB을 다시 로그인하고 쿠키 정보를 입력해.`,
                //                 inline: true
                //             },
                //             {
                //                 name: "해결 방법 [3]",
                //                 value: `???`,
                //                 inline: true
                //             },
                //         )
                //         .setColor(text.DANGER_COLOR)
                //     interaction.update({ embeds: [Embed], ephemeral: true })
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
                // interaction.update({ embeds: [Embed], ephemeral: true });

                async function waitFor(ms) {
                    await new Promise(resolve => setTimeout(resolve, ms));
                }

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
                        interaction.update({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.SRC_ISSUE).setColor(text.MIYABI_COLOR)], components: [] })
                    });
                }
            }
        }
    }
})