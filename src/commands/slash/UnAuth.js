const {
    CommandInteraction,
    EmbedBuilder
} = require("discord.js");
const hoyolab = require("../../models/hoyolab");
const text = require("../../events/utils/TextMap.json");

module.exports = {
    name: text.SC_IS_UNAUTH_NAME,
    description: text.SC_IS_UNAUTH_DESC,
    cooldown: 5000,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        try {
            hoyolab.findOne({ where: { user_id: interaction.user.id } })
                .then(async (hoyolab) => {
                    if (hoyolab.is_authorized) {
                        await hoyolab.update({
                            is_authorized: false,
                            authcookie: null,
                            hoyolab_uid: null
                        });

                        const Embed = new EmbedBuilder()
                            .setTitle(text.AUTH_SUCCESS)
                            .setDescription(text.AUTH_WARNING)
                            .setColor(text.MIYABI_COLOR)
                        interaction.reply({ embeds: [Embed] })
                    } else {
                        interaction.reply({ content: text.AUTH_ERROR })
                    }
                })
        } catch (err) {
            interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.SRC_ISSUE).setColor(text.MIYABI_COLOR)], components: [] });
            throw err;
        }
    }
}