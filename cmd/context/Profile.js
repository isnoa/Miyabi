const {
    ContextMenuCommandInteraction,
    ApplicationCommandType,
    EmbedBuilder
} = require("discord.js");
const user = require("../../events/models/user");
const zzz = require("../../events/models/zzz");
const text = require("../../events/utils/TextMap.json");
const { getUserGameInfoMachine } = require("../../events/utils/dataMachine");

module.exports = {
    name: text.SC_IS_PROFILE_NAME,
    type: ApplicationCommandType.User,
    cooldown: 5000,
    /**
     * 
     * @param {Client} client 
     * @param {ContextMenuCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        try {
            let target = await client.users.fetch(interaction.targetId);

            Promise.all([
                user.findOne({ where: { user_id: target.id } }),
                zzz.findOne({ where: { user_id: target.id } })
            ]).then(async ([userData, zzzData]) => {

                if (!userData && !zzzData) return interaction.reply({ embeds: [new EmbedBuilder().setDescription((text.MISMATCHED_DATA).replace("{user}", target)).setColor(text.MIYABI_COLOR)] })

                const userInfo = await getUserGameInfoMachine(zzzData.authcookie, zzzData.srv_reg);
                const regInfo = await recognizeServer(zzzData.srv_uid);

                const Embed = new EmbedBuilder()
                    .setTitle(target.username)
                    .setFields(
                        {
                            name: text.PROFILE_NAME,
                            value: userInfo.nickname ? userInfo.nickname : text.UNKNOWN,
                            inline: true
                        },
                        {
                            name: text.PROFILE_UID,
                            value: zzzData.is_hide_profile ? text.UNKNOWN : zzzData.srv_uid,
                            inline: true
                        },
                        {
                            name: text.PROFILE_REGION,
                            value: zzzData.srv_uid ? regInfo : text.UNKNOWN,
                            inline: true
                        }
                    )
                    .setThumbnail(target.avatarURL({ dynamic: true, size: 2048 }))
                    .setColor(text.MIYABI_COLOR)

                if (["1010159742104113162"].includes(target.id)) {
                    Embed.setAuthor({ name: "DEVELOPER", iconURL: "https://cdn.discordapp.com/attachments/1019924590723612733/1070782165362675842/IconSilver_1475898.png" })
                        .setImage("https://cdn.discordapp.com/attachments/1019924590723612733/1128710777335988224/-__ZZZ_Trailer_yZy_-iZTzP8_-_1920x810_-_0m11s1.png")
                }
                if (["893424082945720351"].includes(target.id)) {
                    Embed.setAuthor({ name: "DEVELOPER", iconURL: "https://cdn.discordapp.com/attachments/1019924590723612733/1070782165362675842/IconSilver_1475898.png" })
                        .setImage("https://upload-os-bbs.hoyolab.com/upload/2023/04/18/e3571431cda03b9df8dda1e341f9b975_2275000779002878493.png")
                }

                if (target.id === interaction.user.id) {
                    return interaction.reply({ embeds: [Embed], ephemeral: userData.is_hide_profile })
                } else if (userData.is_hide_profile === true) {
                    return interaction.reply({ embeds: [Embed] })
                } else {
                    interaction.reply({ embeds: [new EmbedBuilder().setDescription((text.MISMATCHED_DATA).replace("{user}", target)).setColor(text.MIYABI_COLOR)] })
                }
            })
        } catch (err) {
            interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.SRC_ISSUE).setColor(text.MIYABI_COLOR)], components: [] })
            throw err;
        }
    }
}

function recognizeServer(uid) {
    const server = {
        "1": "지원하지 않는 서버입니다.",
        "2": "지원하지 않는 서버입니다.",
        "5": "지원하지 않는 서버입니다.",
        "6": "북미",
        "7": "유럽",
        "8": "아시아",
        "9": "대만·홍콩·마카오",
    }[String(uid)[0]];
    
    if (server) {
        return server;
    } else {
        interaction.reply({ content: `UID ${uid} isn't associated with any server` });
    }
}
