const {
    ContextMenuCommandInteraction,
    ApplicationCommandType,
    EmbedBuilder
} = require("discord.js");
const db = require("../../database/user.js");
const { MiyabiColor } = require("../../database/color.js");
const text = require("../../database/ko-kr.js");
const logger = require("../../events/core/logger.js");

module.exports = {
    name: "프로필",
    type: ApplicationCommandType.User,
    /**
     * 
     * @param {Client} client 
     * @param {ContextMenuCommandInteraction} interaction 
     * @param {String[]} args 
     */
    run: async (client, interaction) => {
        const userMatch = interaction.user.id == interaction.targetId
        if (userMatch) {
            db.findOne({ user: interaction.user.id }).then(async(userData) => {
                if (userData) {
                    const Embed = new EmbedBuilder()
                        .setDescription(userData.introduce ?? "-")
                        .setFields(
                            {
                                name: text.UIProfileRegist,
                                value: `<t:${parseInt(userData.timestamp / 1000)}:R>`,
                                inline: true
                            },
                            {
                                name: text.UIProfileRSC,
                                value: text[userData.lastcharacter ?? "none"],
                                inline: true
                            },
                            {
                                name: text.UIProfileZZZConnect,
                                value: text[!!userData.zzzconnect ?? "false"],
                                inline: true
                            },
                            {
                                name: text.UIProfileDailyCheckIn,
                                value: text[userData.dailycheckin ?? "false"],
                                inline: true
                            }
                        )
                        .setThumbnail(interaction.user.avatarURL({ dynamic: true, size: 2048 }))
                        .setColor(MiyabiColor)
                    if (userData.uid) {
                        Embed.setTitle(interaction.user.tag + `(${userData.uid})`)
                    } else {
                        Embed.setTitle(interaction.user.tag)
                    }
                    if (["1010159742104113162"].includes(interaction.user.id)) {
                        Embed.setAuthor({ name: "DEVELOPER", iconURL: "https://cdn.discordapp.com/attachments/1019924590723612733/1070782165362675842/IconSilver_1475898.png" })
                        Embed.setImage("https://cdn.discordapp.com/attachments/1019924590723612733/1076696736900333659/71ed8c758171edce1937ae9fb8a7a2c5_4050754917781907821.jpg")
                    }
                    if (["893424082945720351"].includes(interaction.user.id)) {
                        Embed.setAuthor({ name: "DEVELOPER", iconURL: "https://cdn.discordapp.com/attachments/1019924590723612733/1070782165362675842/IconSilver_1475898.png" })
                        Embed.setImage("https://cdn.discordapp.com/attachments/1019924590723612733/1070782029047799808/f1d877681aeed2f1da2cd7cd4acb996111c9655f22ea19b5332ae3c2bdee34f1.png")
                    }
                    if (userData.viewprofile === true) {
                        interaction.reply({ embeds: [Embed] })
                        logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Request Values: [${interaction.targetId}] || Interaction Latency: [${Math.abs(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
                    } else {
                        interaction.reply({ embeds: [Embed], ephemeral: true })
                        logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Request Values: [${interaction.targetId}] || Interaction Latency: [${Math.abs(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
                    }
                } else {
                    interaction.reply({ embeds: [new EmbedBuilder().setDescription(interaction.user.username + "," + text.UIMismatchData).setColor(MiyabiColor)] })
                }
            }).catch((err) => {
				if (err) throw err;
			})
        } else {
            const user = await client.users.fetch(interaction.targetId);
            db.findOne({ user: user.id }).then(async(userData) => {
                if (userData) {
                    if (userData.viewprofile === true) {
                        const Embed = new EmbedBuilder()
                            .setTitle(user.tag)
                            .setDescription(userData.introduce ?? "-")
                            .setFields(
                                {
                                    name: text.UIProfileRegist,
                                    value: `<t:${parseInt(userData.timestamp / 1000)}:R>`,
                                    inline: true
                                },
                                {
                                    name: text.UIProfileRSC,
                                    value: text[userData.lastcharacter ?? "none"],
                                    inline: true
                                },
                                {
                                    name: text.UIProfileZZZConnect,
                                    value: text[!!userData.zzzconnect ?? "false"],
                                    inline: true
                                },
                                {
                                    name: text.UIProfileDailyCheckIn,
                                    value: text[userData.dailycheckin ?? "false"],
                                    inline: true
                                }
                            )
                            .setThumbnail(user.avatarURL({ dynamic: true, size: 2048 }))
                            .setColor(MiyabiColor)
                        if (["1010159742104113162"].includes(user.id)) {
                            Embed.setAuthor({ name: "DEVELOPER", iconURL: "https://cdn.discordapp.com/attachments/1019924590723612733/1070782165362675842/IconSilver_1475898.png" })
                            Embed.setImage("https://cdn.discordapp.com/attachments/1019924590723612733/1070787654620291152/100477646_p0.jpg")
                        }
                        if (["893424082945720351"].includes(user.id)) {
                            Embed.setAuthor({ name: "DEVELOPER", iconURL: "https://cdn.discordapp.com/attachments/1019924590723612733/1070782165362675842/IconSilver_1475898.png" })
                            Embed.setImage("https://cdn.discordapp.com/attachments/1019924590723612733/1070782029047799808/f1d877681aeed2f1da2cd7cd4acb996111c9655f22ea19b5332ae3c2bdee34f1.png")
                        }
                        interaction.reply({ embeds: [Embed] })
                        logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Request Values: [${interaction.targetId}] || Interaction Latency: [${Math.abs(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
                    } else {
                        interaction.reply({ embeds: [new EmbedBuilder().setDescription(user.username + "," + [text.failedToCheckData ?? text.UIMismatchData]).setColor(MiyabiColor)] })
                    }
                } else {
                    interaction.reply({ embeds: [new EmbedBuilder().setDescription(user.username + "," + text.UIMismatchData).setColor(MiyabiColor)] })
                }
            }).catch((err) => {
				if (err) throw err;
			})
        }
    }
}