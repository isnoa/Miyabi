const {
    ContextMenuCommandInteraction,
    ApplicationCommandType,
    EmbedBuilder
} = require("discord.js");
const user = require("../../events/models/user");
const zzz = require("../../events/models/zzz");
const text = require("../../events/utils/ko-kr");
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

                const Embed = new EmbedBuilder()
                    .setTitle(`${zzzData.srv_uid ? `${target.username}(${zzzData.srv_uid})` : target.username}`)
                    .setFields(
                        {
                            name: text.PROFILE_NAME,
                            value: userInfo.nickname ? userInfo.nickname : text.UNKNOWN,
                            inline: true
                        },
                        {
                            name: text.PROFILE_UID,
                            value: zzzData.srv_uid ? zzzData.srv_uid : text.UNUSED,
                            inline: true
                        },
                        {
                            name: text.PROFILE_REGION,
                            value: zzzData.srv_reg ? zzzData.srv_reg : text.UNUSED,
                            inline: true
                        }
                    )
                    .setThumbnail(interaction.user.avatarURL({ dynamic: true, size: 2048 }))
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
                console.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`)
            })
        } catch (err) {
            console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`)
        }
    }
}

function regions(reg) {
    switch (reg) {
        case "os_asia":
            
            break;
    
        default:
            break;
    }
}