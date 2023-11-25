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
const hoyolab = require("../../models/hoyolab");
const text = require("./TextMap.json");
const { createMiHoYoDataMachine } = require('./dataMachine');

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'AuthModalButton') {
            const AuthModal = new ModalBuilder()
                .setCustomId('AuthTitleModal')
                .setTitle(text.AUTH_TITLE)
            const AuthLtokenInput = new TextInputBuilder()
                .setCustomId('AuthLtokenInput')
                .setLabel(`${text.REQUIRED_VALUE}: ltoken`)
                .setStyle(TextInputStyle.Short)
                .setMinLength(40)
                .setRequired(true)
            const AuthLtuidInput = new TextInputBuilder()
                .setCustomId('AuthLtuidInput')
                .setLabel(`${text.REQUIRED_VALUE}: ltuid`)
                .setStyle(TextInputStyle.Short)
                .setMinLength(9)
                .setRequired(true)

            const AuthLtokenRow = new ActionRowBuilder().addComponents(AuthLtokenInput)
            const AuthLtuidRow = new ActionRowBuilder().addComponents(AuthLtuidInput)
            AuthModal.addComponents(AuthLtokenRow, AuthLtuidRow)
            await interaction.showModal(AuthModal);
        }

        if (interaction.customId === 'AuthYesButton') {
            const { cookies } = client;

            if (!cookies.has(interaction.user.id))
                return interaction.update("1분이 경과돼서 쿠키 값이 존재하지 않아, 다시 시도하길 바라.");

            const cookie = cookies.get(interaction.user.id);
            await encryptCookie(cookie);

            const Embed = new EmbedBuilder()
                .setTitle("등록 완료")
                .setDescription(profile.message)

            interaction.update({ embeds: [Embed], ephemeral: true });

        } else if (interaction.customId === 'AuthNoButton') {
            interaction.update({ content: "음, 아니야? 기록은 없애는 걸로 할게, 검술 수련도 있으니 용건이 없으면 돌아가도록 할게.", embeds: [], components: [] })
            await waitFor(5000);

            return interaction.deleteReply();
        } else if (interaction.customId === 'AuthCancelButton') {
            interaction.update({ content: "음, 취소? 그래, 그러도록 할게. 회의와 보고서 제출이 겹쳐서 바쁘니 용건이 없으면 돌아가도록 할게.", embeds: [], components: [] })

            await waitFor(5000);
            return interaction.deleteReply();
        }
    }

    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'AuthTitleModal') {
            const ltoken = interaction.fields.getTextInputValue('AuthLtokenInput').replace(/\s+/g, '');
            const ltuid = interaction.fields.getTextInputValue('AuthLtuidInput').replace(/\s+/g, '');
            const cookie = `ltoken=${ltoken}; ltuid=${ltuid};`;

            const dataMachine = createMiHoYoDataMachine(cookie);

            const hoyolabPromise = await dataMachine.get(`https://bbs-api-os.hoyolab.com/community/painter/wapi/user/full?uid=${ltuid}`).then(res => res.data);
            const ingamePromise = await dataMachine.get(`https://bbs-api-os.hoyolab.com/game_record/card/wapi/getGameRecordCard?uid=${ltuid}`).then(res => res.data);

            axios.all([hoyolabPromise, ingamePromise])
                .then(axios.spread(async (hoyolabRes, ingameRes) => {
                    if (hoyolabRes.retcode !== 0) {
                        const Embed = new EmbedBuilder()
                            .setDescription("쿠키 정보를 정확하게 입력하거나 HoYoLAB을 다시 로그인하고 입력해.")
                            .setColor(text.DANGER_COLOR)

                        return interaction.update({ embeds: [Embed], components: [], ephemeral: true })
                    }

                    const Embed = new EmbedBuilder()
                        .setAuthor({ iconURL: "https://play-lh.googleusercontent.com/KtDuSNwcx8nuDg5AGincsvLVm1xn7gfitdD7E9TVBC7C9zShz_oKOTwSNM7CzFP7pcI", name: `'${hoyolabRes.data.user_info.nickname}'이(가) 네 계정이 맞아?` })
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

                    const ingameInfo = await ingameListOne(ingameRes);

                    const uid = ingameInfo.game_uid;
                    const region = ingameInfo.region;

                    cookiesCollection(cookie, uid, region);
                    return interaction.update({ embeds: [Embed], components: [Row], ephemeral: true });
                }))
                .catch(err => {
                    interaction.update({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.SRC_ISSUE).setColor(text.MIYABI_COLOR)], components: [] })
                    throw err;
                });
        }
    }

    async function ingameListOne(req) {
        let foundItem;
        for (let i = 0; i < req.data.list.length; i++) {
            // 2 = 젠레스 존 제로의 game_id
            if (req.data.list[i].game_id === 2) {
                foundItem = req.data.list[i];
                break;
            }
        }

        if (!foundItem) return null;

        return foundItem;
    }

    function cookiesCollection(cookie, uid, region) {
        const { cookies } = client;

        if (cookies.has(interaction.user.id)) {
            cookies.delete(interaction.user.id);
        }

        cookies.set(interaction.user.id, {
            "cookie": cookie,
            "uid": uid,
            "region": region
        });
        setTimeout(() => {
            cookies.delete(interaction.user.id);
        }, 60000);

        return;
    }

    async function encryptCookie(cookie) {
        const algorithm = process.env.SECRET_ALGORITHM;
        const key = process.env.SECRET_KEY;
        const iv = process.env.SECRET_IV;
        const digest = process.env.SECRET_DIGEST;

        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encryptedCookie = cipher.update(cookie, 'utf8', 'base64');
        encryptedCookie += cipher.final('base64');

        await storeCookie(encryptedCookie, uid);
    }

    async function storeCookie(interaction, encryptedCookie, uid) {
        try {
            const [userData, hoyolabData] = await Promise.all([
                user.findOne({ where: { user_id: interaction.user.id } }),
                hoyolab.findOne({ where: { user_id: interaction.user.id } }),
            ]);

            const userUpdateData = {
                is_show_uid: true,
                is_show_profile: true,
            };

            const hoyolabUpdateData = {
                is_authorized: true,
                authcookie: encryptedCookie,
                hoyolab_uid: uid,
            };

            if (userData) {
                await user.update(userUpdateData, { where: { user_id: interaction.user.id } });
            } else {
                await user.create({
                    user_id: interaction.user.id,
                    ...userUpdateData,
                });
            }

            if (hoyolabData) {
                await hoyolab.update(hoyolabUpdateData, { where: { user_id: interaction.user.id } });
            } else {
                await hoyolab.create({
                    user_id: interaction.user.id,
                    ...hoyolabUpdateData,
                });
            }
        } catch (err) {
            console.error(err);

            await interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("에러 발견")
                        .setDescription(`\`\`\`${err.message}\`\`\`\n` + text.SRC_ISSUE)
                        .setColor(text.MIYABI_COLOR),
                ],
                components: []
            });
        }
    }
})

async function waitFor(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}
