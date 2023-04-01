const {
    CommandInteraction,
    EmbedBuilder
} = require("discord.js");
const logger = require("../../events/core/logger.js");

module.exports = {
    name: "정보",
    description: "나에 대해 알려줄게.",
    timeout: 5000,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const Embed = new EmbedBuilder()
            .setTitle("MIYABI에 대해")
            .setDescription("MIYABI는 「Zenless Zone Zero」에 나오는 캐릭터 중에 하나입니다.\n<@1010159742104113162>가 세뇌를 걸어서 정식 출시 이후 지금까지 저희와 함께하고 있으며, 보다 나은 서비스의 퀄리티로 보답해 드리도록 더욱 노력하겠습니다.\n⠀")
            .setFields(
                {
                    name: "—이용 및 통계",
                    value: `나는 ${client.guilds.cache.size}개의 서버에서 활동 중이야 그리고 ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}명의 사용자들이 내 도움을 받고있지.`
                },
                {
                    name: "—명령어",
                    value: "[자세히 알아보기](https://www)"
                },
                {
                    name: "—개발자",
                    value: "<@1010159742104113162>"
                }
            )
            .setImage("https://cdn.discordapp.com/attachments/1019924590723612733/1080400140080250880/184908dc4ea4cacdc.jpg")
        interaction.reply({ embeds: [Embed], ephemeral: true })
        logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Request Values: [none] || Interaction Latency: [${Math.abs(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
    }
}