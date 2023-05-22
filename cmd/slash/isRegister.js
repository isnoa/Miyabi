'use strict';
const {
    CommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType
} = require("discord.js");
const { MiyabiColor } = require("../../modules/color.js");

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
            .setDescription([
                "**흠? 가입을 하고 싶다고? 좋아, 그럼 설명을 잘 읽어봐.**",
                "디바이스에 맞게 영상을 시청 후, 값들을 서 순에 맞게 입력해서 주면 돼.",
                "만약에 궁금한 게 생기면 아래에 링크된 서포터 서버로 가서 문의하도록 해.",
            ].join('\n'))
            .setColor(MiyabiColor)

        const topRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("PC(macOS, Windows)")
                    .setStyle(ButtonStyle.Link)
                    .setURL("discord://"),
                new ButtonBuilder()
                    .setLabel("Mobile(iOS, android)")
                    .setStyle(ButtonStyle.Link)
                    .setURL("discord://"),
            );

        const underRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('RegistrationButton')
                    .setLabel('가입하기')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("qna")
                    .setLabel("자주 묻는 질문")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setLabel("서포터 서버")
                    .setStyle(ButtonStyle.Link)
                    .setURL("discord://"),
            );

        await interaction.reply({ embeds: [Embed], components: [topRow, underRow], ephemeral: true })
        console.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
    }
}