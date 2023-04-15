'use strict';
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
    cooldown: 5000,
    /**
     * 
     * @param {Client} client 
     * @param {ContextMenuCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const target = await client.users.fetch(interaction.targetId);

        try {
            const user = await db.findOne({ userId: target.id });
            if (!user) {
                interaction.reply({ embeds: [new EmbedBuilder().setDescription(target.username + "," + text.UIMismatchData).setColor(MiyabiColor)] })
            }

            const Embed = new EmbedBuilder()
                .setTitle(`${user.uid ? `${target.tag}(${user.uid})` : target.tag}`)
                .setDescription("-")
                .setFields(
                    {
                        name: text.UIProfileRegist,
                        value: `<t:${Math.floor(new Date(user.zzzdate).getTime() / 1000)}:R>`,
                        inline: true
                    },
                    {
                        name: text.UIProfileRSA,
                        value: text[user.lastagent ?? "none"],
                        inline: true
                    },
                    {
                        name: text.UIProfileZZZConnect,
                        value: text[!!user.zzzconnect ?? "false"],
                        inline: true
                    },
                    {
                        name: text.UIProfileDailyCheckIn,
                        value: text[user.dailycheckin ?? "false"],
                        inline: true
                    }
                )
                .setThumbnail(target.avatarURL({ dynamic: true, size: 2048 }))
                .setColor(MiyabiColor)

            if (["1010159742104113162"].includes(target.id)) {
                Embed.setAuthor({ name: "DEVELOPER", iconURL: "https://cdn.discordapp.com/attachments/1019924590723612733/1070782165362675842/IconSilver_1475898.png" })
                Embed.setImage("https://cdn.discordapp.com/attachments/1019924590723612733/1076696736900333659/71ed8c758171edce1937ae9fb8a7a2c5_4050754917781907821.jpg")
            }
            if (["893424082945720351"].includes(target.id)) {
                Embed.setAuthor({ name: "DEVELOPER", iconURL: "https://cdn.discordapp.com/attachments/1019924590723612733/1070782165362675842/IconSilver_1475898.png" })
                Embed.setImage("https://cdn.discordapp.com/attachments/1019924590723612733/1070782029047799808/f1d877681aeed2f1da2cd7cd4acb996111c9655f22ea19b5332ae3c2bdee34f1.png")
            }
            // 지분지신
            if (user.userId === interaction.user.id) {
                interaction.reply({ embeds: [Embed], ephemeral: !user.viewprofile })
            } else {
                // 호카노히토
                if (user.viewprofile === true) {
                    interaction.reply({ embeds: [Embed] })
                } else {
                    interaction.reply({ embeds: [new EmbedBuilder().setDescription(target.username + "," + text.UIMismatchData).setColor(MiyabiColor)] })
                }
            }
            logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`)
        } catch (err) {
            logger.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`)
        }
    }
} 