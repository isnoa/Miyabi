const {
    CommandInteraction,
    EmbedBuilder
} = require("discord.js");
const logger = require("../../events/core/logger.js");

module.exports = {
    name: "픽업",
    description: "현재 픽업 중 혹은 픽업 했던 캐릭터들을 알려줄게.",
    timeout: 5000,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const StartTime = "4월 24일"
        const EndTime = "5월 24일"

        const Embed = new EmbedBuilder()
            .setTitle("픽업 중인 에이전트 「따웨이거」")
            .setDescription(`가챠 성공률 69퍼\n${StartTime} ~ ${EndTime}까지.`)
        interaction.reply({ embeds: [Embed] })
        logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Request Values: [none] || Interaction Latency: [${Math.abs(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
    }
}