const {
	CommandInteraction,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "픽업",
    description: "현재 픽업 중 혹은 픽업 했던 캐릭터들을 알려줄게.",
    cooldown: 5000,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const StartTime = "4월 24일"
        const EndTime = "5월 24일"

        const Embed = new EmbedBuilder()
            .setTitle("픽업 중인 에이전트 「따웨이거」")
            .setDescription(`가챠 성공률 69퍼\n${StartTime} ~ ${EndTime}까지.`)
            .setFields({
                    name: "메비우스",
                    value: "농ㅋㅋ해지면 귀여움",
                    inline: false
                })
        await interaction.reply({ embeds: [Embed] })
        console.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
    }
}