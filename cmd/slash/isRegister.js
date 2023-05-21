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
            .setDescription("**음? 가입을 하고 싶다고? 좋아 그럼 설명을 잘 읽어봐.**\n디바이스에 맞게 영상을 시청 후, 값들을 서 순에 맞게 입력해서 주면 돼.\n만약에 궁금한 게 생기면 [이 서버](/:discord)로 와서 문의하도록 해.\n**[[PC로 가입하기](https://youtu.be/L_QoItnWSa0, '영상 보러 가기')]** **|** **[[모바일로 가입하기](https://youtu.be/L_QoItnWSa0, '영상 보러 가기')]**")
            .setColor(MiyabiColor)

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('RegistrationButton')
                    .setLabel('가입하기')
                    .setStyle(ButtonStyle.Primary),
            );
        await interaction.reply({ embeds: [Embed], components: [row], ephemeral: true })
        console.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
    }
}