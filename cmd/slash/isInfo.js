const {
	CommandInteraction,
    EmbedBuilder
} = require("discord.js");
const text = require("../../events/utils/ko-kr");

module.exports = {
    name: text.SC_IS_INFO_NAME,
    description: "「나」에 대해 알려줄게.",
    cooldown: 5000,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const Embed = new EmbedBuilder()
            .setTitle("MIYABI에 대해")
            .setDescription("MIYABI는 「Zenless Zone Zero」에 나오는 캐릭터 중에 하나입니다. [노아](https://discord.com/users/1010159742104113162)의 생각 아래에 진행되고 있는 프로젝트이며, 상식개변(돈과 미야비를 등가교환) 시켜서 로프꾼 여러분과 함께하고 있습니다!")
            .setFields(
                {
                    name: "#이용 및 통계",
                    value: `현재 \`${client.guilds.cache.size}\`개의 서버에서 활동 중이며 \`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}\`명의 로프꾼분께서 도움 받고 계십니다!\n\n\n**#미야비 개발자**\n- [노아](https://discord.com/users/1010159742104113162) (모든 프로젝트 담당)\n- [윤](https://discord.com/users/1010159742104113162) (게임정보수집, 사이트 담당)`,
                    inline: true
                },
                {
                    name: "#개발 기간 & 관련 프로젝트",
                    value: "> 2022/07/17 ~ 현재까지\n> (매일 최소 4시간 [6개])\n- MIYABI 프로젝트\n- Linked-Role 프로젝트\n- DAILY-CHECK-In 프로젝트\n- SNS Notice 프로젝트\n- zeroArchive API 프로젝트\n- WebSite 프로젝트",
                    inline: true
                },
                {
                    name: "#후원금",
                    value: `정신력이 강한 탓에 굴복 시킬려면 큰 힘이 필요합니다! 개발자를 도와주세요!\n${progressBar(0, 100, 20)}`
                }
            )
            .setImage("https://cdn.discordapp.com/attachments/1019924590723612733/1093910093352939620/-__ZZZ_Trailer_yZy_-iZTzP8_-_1920x810_-_0m11s1.png")
            .setColor(text.ColourOfMiyabi)
        await interaction.reply({ embeds: [Embed], ephemeral: true })
        console.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
    
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
            const percentageText = Math.round((minValue / maxValue) * 100) + '/100%'
            const bar = '\```목표치: [' + progressText + emptyProgressText + '] ' + percentageText + ' 달성\```'
            return bar;
        }
    }
}