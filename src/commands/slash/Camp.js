const {
	CommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder
} = require("discord.js");
const axios = require("axios");
const text = require("../../events/utils/TextMap.json");

module.exports = {
	name: text.SC_IS_CAMP_NAME,
	description: text.SC_IS_CAMP_DESC,
	cooldown: 5000,
	options: [{
		name: text.SC_SUB_NAME,
		description: text.SC_SUB_NAME_DESC,
		type: ApplicationCommandOptionType.String,
		required: true,
		autocomplete: true
	}],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		try {
			let campName = interaction.options.getString(text.SC_SUB_NAME);
			if (!campName) return interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`이름을 찾을 수 없어.\`\`\`\n` + text.SRC_ISSUE).setColor(text.MIYABI_COLOR)] });

			await axios.get(`https://zenlessdata.web.app/upload/community/data/zenless/${campName}/camp/TextMap.json.json`).then(async (campData) => {
				const Embed = new EmbedBuilder()
					.setTitle(campData.data.ZZZCamp.camp_info[0].camp_name)
					.setDescription('> ' + campData.data.ZZZCamp.camp_info[0].camp_desc)
					.setColor(campData.data.ZZZCamp.camp_info[0].camp_original_color)
					.setImage(campData.data.ZZZCamp.camp_info[0].camp_banner)
					.setThumbnail(campData.data.ZZZCamp.camp_info[0].camp_logo)
					.addFields({ name: "소속된 에이전트", value: campData.data.ZZZCamp.camp_info[1].camp_character.map(agents => `— ${agents}`).join('\n') })
				await interaction.reply({ embeds: [Embed] })
			})
		} catch (err) {
			interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.SRC_ISSUE).setColor(text.MIYABI_COLOR)], components: [] })
			throw err;
		}
	}
}