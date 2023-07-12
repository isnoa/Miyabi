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
                user.findOne({ where: { user_id: interaction.user.id } }),
                zzz.findOne({ where: { user_id: interaction.user.id } })
            ]).then(([userData, zzzData]) => {
                const Embed = new EmbedBuilder()
                    .setTitle(`${zzzData.srv_uid ? `${target.username}(${zzzData.srv_uid})` : target.username}`)
                    .setDescription("-")
                    .setFields(
                        {
                            name: text.UIProfileRegist,
                            value: `<t:${Math.floor(new Date(zzzData.updated_at).getTime() / 1000)}:D>`,
                            inline: true
                        },
                        {
                            name: text.UIProfileAuth,
                            value: text[zzzData.is_authorized],
                            inline: true
                        },
                        {
                            name: text.UIProfileUid,
                            value: text[zzzData.srv_reg],
                            inline: true
                        },

                    )
                    .setThumbnail(target.avatarURL({ dynamic: true, size: 2048 }))
                    .setColor(text.UIColourMiyabi)

                if (["1010159742104113162"].includes(target.id)) {
                    Embed.setAuthor({ name: "DEVELOPER", iconURL: "https://cdn.discordapp.com/attachments/1019924590723612733/1070782165362675842/IconSilver_1475898.png" })
                    Embed.setImage("https://upload-os-bbs.hoyolab.com/upload/2023/04/18/91aeff3255116677955b45429129c427_453567368113763697.png")
                }
                if (["893424082945720351"].includes(target.id)) {
                    Embed.setAuthor({ name: "DEVELOPER", iconURL: "https://cdn.discordapp.com/attachments/1019924590723612733/1070782165362675842/IconSilver_1475898.png" })
                    Embed.setImage("https://upload-os-bbs.hoyolab.com/upload/2023/04/18/e3571431cda03b9df8dda1e341f9b975_2275000779002878493.png")
                }

                // 지분지신
                if (target.id === interaction.user.id) {
                    interaction.reply({ embeds: [Embed], ephemeral: !user.is_show_profile })
                } else {
                    // 호카노히토
                    if (userData.is_show_profile === true) {
                        interaction.reply({ embeds: [Embed] })
                    } else {
                        interaction.reply({ embeds: [new EmbedBuilder().setDescription(userMention(target.id) + text.UIMisMatchData).setColor(text.UIColourMiyabi)] })
                    }
                }
                console.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`)
            })
        } catch (err) {
            console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`)
        }
    }
} 