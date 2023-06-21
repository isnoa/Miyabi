const {
    CommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const text = require("../../events/modules/ko-kr.js");

module.exports = {
    name: "가입",
    description: "「Zenless Zone Zero」와 관련된 명령어들을 사용할 수 있도록 가입을 하는걸 도와줄게.",
    cooldown: 5000,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const Embed = new EmbedBuilder()
            .setDescription(text.UISettingUnknownDocument.join('\n'))
            .setColor(text.UIColourMiyabi)

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
        console.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
    }
}