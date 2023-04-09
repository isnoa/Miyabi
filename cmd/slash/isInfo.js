const {
    CommandInteraction,
    EmbedBuilder
} = require("discord.js");
const logger = require("../../events/core/logger.js");
const { MiyabiColor } = require("../../database/color.js");

module.exports = {
    name: "정보",
    description: "나에 대해 알려줄게.",
    cooldown: 5000,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction) => {
        const Embed = new EmbedBuilder()
            .setTitle("MIYABI에 대해")
            .setDescription("MIYABI는 「Zenless Zone Zero」에 나오는 캐릭터 중에 하나입니다.\n<@1010159742104113162>가 상식개변(돈과 미야비를 등가교환) 시켜서 로프꾼 여러분과 함께하고 있습니다!")
            .setFields(
                {
                    name: "—이용 및 통계",
                    value: `현재 MIYABI는 ${client.guilds.cache.size}개의 서버에서 활동 중이며 ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}명의 로프꾼분들께서 도움을 받고 계십니다!`
                },
                {
                    name: "—개발자",
                    value: "<@1010159742104113162>(미야비 담당) / <@893424082945720351>(게임정보, 사이트 담당)"
                },
                {
                    name: "—후원금",
                    value: `정신력이 강한 탓에 굴복 시킬려면 큰 힘이 필요합니다 개발자를 도와주세요!\n${progressBar(0, 100, 10)}`
                }
            )
            .setImage("https://cdn.discordapp.com/attachments/1019924590723612733/1093910093352939620/-__ZZZ_Trailer_yZy_-iZTzP8_-_1920x810_-_0m11s1.png")
            .setColor(MiyabiColor)
        interaction.reply({ embeds: [Embed], ephemeral: true })
        logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
    
        /**
         * Create a text progress bar
         * @param {Number} minValue - The min value to fill the bar
         * @param {Number} maxValue - The max value of the bar
         * @param {Number} size - The text bar size
         * @return {String} The text bar
         */
        function progressBar(minValue, maxValue, size) {
            const progressText = '▇'.repeat(Math.round((size * (minValue / maxValue))))
            const emptyProgressText = '—'.repeat(size - (Math.round((size * (minValue / maxValue)))))
            const percentageText = Math.round((minValue / maxValue) * 100) + '%'
            const bar = '```목표치 중 [' + progressText + emptyProgressText + ']' + percentageText + ' 달성```'
            return bar;
        }
    }
}