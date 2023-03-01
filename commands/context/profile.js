const { ContextMenuCommandInteraction, ApplicationCommandType, EmbedBuilder } = require("discord.js");
const db = require("../../database/user");
const { MiyabiColor } = require("../../database/color");
const text = require("../../database/ko-kr.js");

module.exports = {
    name: "Profile",
    name_localizations: {
        "ko": "프로필",
        "ja": "プロフィール"
    },
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
            db.findOne({ user: interaction.user.id }, async (err, userData) => {
                if (userData) {
                    // const color = interaction.member.displayHexColor;
                    const Embed = new EmbedBuilder()
                        .setDescription(userData.description ?? "-")
                        .setFields(
                            {
                                name: text.UIProfileRegist,
                                value: `<t:${parseInt(userData.since / 1000)}:R>`,
                                inline: true
                            },
                            {
                                name: text.UIProfileRSC,
                                value: text[userData.nowcharacter ?? "none"],
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
                    if (["985121434428911628"].includes(interaction.user.id)) {
                        Embed.setAuthor({ name: "MIYABI", iconURL: "https://cdn.discordapp.com/attachments/1019924590723612733/1070782114036986016/IconRoleCircle13_1178533.png" })
                    }
                    if (["1010159742104113162"].includes(interaction.user.id)) {
                        Embed.setAuthor({ name: "DEVELOPER", iconURL: "https://cdn.discordapp.com/attachments/1019924590723612733/1070782165362675842/IconSilver_1475898.png" })
                        Embed.setImage("https://cdn.discordapp.com/attachments/1019924590723612733/1076696736900333659/71ed8c758171edce1937ae9fb8a7a2c5_4050754917781907821.jpg")
                    }
                    if (["893424082945720351"].includes(interaction.user.id)) {
                        Embed.setAuthor({ name: "DEVELOPER", iconURL: "https://cdn.discordapp.com/attachments/1019924590723612733/1070782165362675842/IconSilver_1475898.png" })
                        Embed.setImage("https://cdn.discordapp.com/attachments/1019924590723612733/1070782029047799808/f1d877681aeed2f1da2cd7cd4acb996111c9655f22ea19b5332ae3c2bdee34f1.png")
                    }
                    if (userData.profileconnect === true) {
                        interaction.reply({ embeds: [Embed] })
                    } else {
                        interaction.reply({ embeds: [Embed], ephemeral: true })
                    }
                } else {
                    interaction.reply({ embeds: [new EmbedBuilder().setDescription(interaction.user.username + "," + " I can't check the data.").setColor(MiyabiColor)] })
                }
            })
        } else {
            const user = await client.users.fetch(interaction.targetId);
            db.findOne({ user: user.id }, async (err, data) => {
                if (data) {
                    if (data.profileconnect === true) {
                        // const member = await interaction.guild.members.fetch(interaction.targetId);
                        // const color = member.displayHexColor;
                        // if (color == '#000000') color = member.hoistRole.hexColor;
                        const Embed = new EmbedBuilder()
                            .setTitle(user.tag)
                            .setDescription(data.description ?? "-")
                            .setFields(
                                {
                                    name: text.UIProfileRegist,
                                    value: `<t:${parseInt(data.since / 1000)}:R>`,
                                    inline: true
                                },
                                {
                                    name: text.UIProfileRSC,
                                    value: text[data.nowcharacter ?? "none"],
                                    inline: true
                                },
                                {
                                    name: text.UIProfileZZZConnect,
                                    value: text[!!data.zzzconnect ?? "false"],
                                    inline: true
                                },
                                {
                                    name: text.UIProfileDailyCheckIn,
                                    value: text[data.dailycheckin ?? "false"],
                                    inline: true
                                }
                            )
                            .setThumbnail(user.avatarURL({ dynamic: true, size: 2048 }))
                            .setColor(MiyabiColor)
                        if (["985121434428911628"].includes(user.id)) {
                            Embed.setAuthor({ name: "MIYABI", iconURL: "https://cdn.discordapp.com/attachments/1019924590723612733/1070782114036986016/IconRoleCircle13_1178533.png" })
                        }
                        if (["1010159742104113162"].includes(user.id)) {
                            Embed.setAuthor({ name: "DEVELOPER", iconURL: "https://cdn.discordapp.com/attachments/1019924590723612733/1070782165362675842/IconSilver_1475898.png" })
                            Embed.setImage("https://cdn.discordapp.com/attachments/1019924590723612733/1070787654620291152/100477646_p0.jpg")
                        }
                        if (["893424082945720351"].includes(user.id)) {
                            Embed.setAuthor({ name: "DEVELOPER", iconURL: "https://cdn.discordapp.com/attachments/1019924590723612733/1070782165362675842/IconSilver_1475898.png" })
                            Embed.setImage("https://cdn.discordapp.com/attachments/1019924590723612733/1070782029047799808/f1d877681aeed2f1da2cd7cd4acb996111c9655f22ea19b5332ae3c2bdee34f1.png")
                        }
                        interaction.reply({ embeds: [Embed] })
                    } else {
                        interaction.reply({ embeds: [new EmbedBuilder().setDescription(user.username + "," + [text.failedToCheckData ?? " I can't check the data."]).setColor(MiyabiColor)] })
                    }
                } else {
                    interaction.reply({ embeds: [new EmbedBuilder().setDescription(user.username + "," + " I can't check the data.").setColor(MiyabiColor)] })
                }
            })
        }
    }
}