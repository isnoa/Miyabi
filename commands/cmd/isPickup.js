const { CommandInteraction, EmbedBuilder } = require("discord.js");
const text = require("../../database/ko-kr.js");

module.exports = {
    name: "픽업",
    description: "현재 픽업 중인 캐릭터",
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
            .setDescription(`가챠 성공률 100퍼\n${StartTime} ~ ${EndTime}까지.`)
        interaction.reply({ embeds: [Embed] })
    }
}