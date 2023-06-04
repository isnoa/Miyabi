'use strict';
const {
    ContextMenuCommandInteraction,
    ApplicationCommandType,
    EmbedBuilder,
    userMention
} = require("discord.js");
const db = require("../../events/core/user.js");
const text = require("../../events/modules/ko-kr.js");

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
            
            const user = await db.findOne({ userId: target.id });
            if (!user) {
                interaction.reply({ embeds: [new EmbedBuilder().setDescription(userMention(target.id) + "의 " + text.UIMismatchData).setColor(text.UIColourMiyabi)] })
            }

            const Embed = new EmbedBuilder()
                .setTitle(`${user.uid ? `${target.tag}(${user.uid})` : target.tag}`)
                .setDescription("-")
                .setFields(
                    {
                        name: text.UIProfileRegist,
                        value: `<t:${Math.floor(new Date(user.zzzDate).getTime() / 1000)}:R>`,
                        inline: true
                    },
                    {
                        name: text.UIProfileRSA,
                        value: text[user.lastAgent ?? "none"],
                        inline: true
                    },
                    {
                        name: text.UIProfileZZZConnect,
                        value: text[!!user.zzzConnect ?? "false"],
                        inline: true
                    },
                    {
                        name: text.UIProfileDailyCheckIn,
                        value: text[user.dailyCheckIn ?? "false"],
                        inline: true
                    }
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
                interaction.reply({ embeds: [Embed], ephemeral: !user.publicProfile })
            } else {
                // 호카노히토
                if (user.publicProfile === true) {
                    interaction.reply({ embeds: [Embed] })
                } else {
                    interaction.reply({ embeds: [new EmbedBuilder().setDescription(userMention(target.id) + "의 " + text.UIMismatchData).setColor(text.UIColourMiyabi)] })
                }
            }
            console.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`)
        } catch (err) {
            console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`)
        }
    }
} 