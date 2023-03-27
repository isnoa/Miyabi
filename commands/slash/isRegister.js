const {
    CommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const { MiyabiColor } = require("../../database/color.js");
const logger = require("../../events/core/logger.js");

module.exports = {
    name: "가입",
    description: "「Zenless Zone Zero」와 관련된 명령어들을 사용할 수 있도록 가입을 하는걸 도와줄게.",
    timeout: 5000,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const Embed = new EmbedBuilder()
            .setDescription("**음? 가입을 하고 싶다고? 좋아 그럼 아래 설명을 잘 읽어봐.**\n디바이스에 맞게 영상을 시청 후에 아래에 있는 `가입하기 버튼`을 눌러서 `ltoken`과 `ltuid`의 값을 입력해주면 돼.\n만약에 궁금한게 생기면 [이 서버](/:discord)로 와서 문의를 하도록 해.\n**[[PC로 가입하기](https://youtu.be/L_QoItnWSa0, '영상 보러가기')]** **|** **[[모바일로 가입하기](https://youtu.be/L_QoItnWSa0, '영상 보러가기')]**")
            .setColor(MiyabiColor)

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('RegistrationButton')
                    .setLabel('가입하기')
                    .setStyle(ButtonStyle.Success),
            );
        interaction.reply({ embeds: [Embed], components: [row], ephemeral: true })
        logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Request Values: [none] || Interaction Latency: [${Math.abs(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
    }
}