const {
    ContextMenuCommandInteraction,
    ApplicationCommandType,
    EmbedBuilder,
    userMention
} = require("discord.js");
const user = require("../../events/models/user.js");
const zzz = require("../../events/models/zzz.js");
const text = require("../../events/utils/ko-kr.js");

module.exports = {
    name: "프로필",
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
            ]).then(([userData, zzzData]) => {

                if (!userData && !zzzData) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(userMention(target.id) + text.UIMisMatchData).setColor(text.UIColourMiyabi)] })

                const Embed = new EmbedBuilder()
                    .setTitle(`${zzzData.srv_uid ? `${target.username}(${zzzData.srv_uid})` : target.username}`)
                    .setDescription("-")
                    .setFields(
                        {
                            name: text.UIProfileName,
                            value: "미야비코박죽",
                            inline: true
                        },
                        {
                            name: text.UIProfileUid,
                            value: zzzData.srv_uid,
                            inline: true
                        },
                        {
                            name: text.UIProfileReg,
                            value: zzzData.srv_reg,
                            inline: true
                        }
                    )
                    .setThumbnail(interaction.user.avatarURL({ dynamic: true, size: 2048 }))
                    .setColor(text.UIColourMiyabi)

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
                    interaction.reply({ embeds: [new EmbedBuilder().setDescription(userMention(target.id) + text.UIMisMatchData).setColor(text.UIColourMiyabi)] })
                }
                console.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`)
            })
        } catch (err) {
            console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`)
        }
    }
} 