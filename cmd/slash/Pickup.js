const {
	CommandInteraction,
    EmbedBuilder
} = require("discord.js");
const text = require("../../events/utils/TextMap");

module.exports = {
    name: text.SC_IS_PICKUP_NAME,
    description: text.SC_IS_PICKUP_DESC,
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
        
    }
}