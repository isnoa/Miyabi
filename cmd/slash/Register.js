const {
    CommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const text = require("../../events/utils/TextMap");

module.exports = {
    name: text.SC_IS_REGISTER_NAME,
    description: text.SC_IS_REGISTER_DESC,
    cooldown: 5000,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const Embed = new EmbedBuilder()
            .setDescription(text.SETTING_REGISTRATION_DOCUMENT.join('\n'))
            .setColor(text.MIYABI_COLOR)

        const Row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('RegistrationButton')
                    .setEmoji("1110886494786302083")
                    .setLabel('가입하기')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setLabel("PC (macOS, Windows)")
                    .setStyle(ButtonStyle.Link)
                    .setURL("discord://"),
                new ButtonBuilder()
                    .setLabel("Mobile (iOS, android)")
                    .setStyle(ButtonStyle.Link)
                    .setURL("discord://"),
            );

        await interaction.reply({ embeds: [Embed], components: [Row], ephemeral: true })
        
    }
}