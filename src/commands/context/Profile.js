const {
    ContextMenuCommandInteraction,
    ApplicationCommandType,
    EmbedBuilder
} = require("discord.js");
const user = require("../../models/user");
const zzz = require("../../models/zzz");
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

                const regInfo = await recognizeServer(zzzData.srv_uid);

                const userInfo = await getUserGameInfoMachine(zzzData.authcookie, regInfo);

                const Embed = new EmbedBuilder()
                    .setTitle(userInfo.nickname)
                    .addFields(
                        {
                            name: text.PROFILE_UID,
                            value: userData.is_show_uid ? zzzData.srv_uid : text.HIDDEN,
                            inline: true
                        }
                    )
                    .setThumbnail(target.avatarURL({ dynamic: true, size: 2048 }))
                    .setColor(text.MIYABI_COLOR)

                if (target.id === interaction.user.id) {
                    return interaction.reply({ embeds: [Embed], ephemeral: userData.is_show_profile })
                } else if (userData.is_show_profile === true) {
                    return interaction.reply({ embeds: [Embed] })
                } else {
                    interaction.reply({ embeds: [new EmbedBuilder().setDescription((text.MISMATCHED_DATA).replace("{user}", target)).setColor(text.MIYABI_COLOR)] })
                }
            })
        } catch (err) {
            interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.SRC_ISSUE).setColor(text.MIYABI_COLOR)], components: [] })
            throw err;
        }

        function recognizeServer(uid) {
            const server = {
                "1": "cn_gf01",
                "2": "cn_gf01",
                "5": "cn_qd01",
                "6": "os_usa",
                "7": "os_euro",
                "8": "os_asia",
                "9": "os_cht",
            }[String(uid)[0]];

            if (!server) return interaction.reply({ content: `UID ${uid} isn't associated with any server` });

            return server;
        }
    }
}