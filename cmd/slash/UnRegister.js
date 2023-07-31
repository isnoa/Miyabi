const {
    CommandInteraction,
    EmbedBuilder
} = require("discord.js");
const zzz = require("../../events/models/zzz");
const text = require("../../events/utils/TextMap");

module.exports = {
    name: text.SC_IS_UNREGISTER_NAME,
    description: text.SC_IS_UNREGISTER_DESC,
    cooldown: 5000,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        try {
            zzz.findOne({ where: { user_id: interaction.user.id } }).then(async (zzz) => {
                if (zzz.is_authorized) {
                    await zzz.update({
                        is_authorized: false,
                        authcookie: null,
                        srv_uid: null
                    });

                    const Embed = new EmbedBuilder()
                        .setTitle(text.SETTING_REGISTRATION_SUCCESS)
                        .setDescription(text.SETTING_REGISTRATION_WARNING)
                        .setColor(text.MIYABI_COLOR)
                    interaction.reply({ embeds: [Embed] })
                } else {
                    interaction.reply({ content: text.SETTING_REGISTRATION_ERROR })
                }
            })
        } catch (err) {
            interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.SRC_ISSUE).setColor(text.MIYABI_COLOR)], components: [] });
            throw err;
        }
    }
}