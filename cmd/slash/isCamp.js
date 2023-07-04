const {
	CommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder
} = require("discord.js");
const axios = require("axios");
const text = require("../../events/utils/ko-kr.js");

module.exports = {
	name: '소속',
	description: '캐릭터가 소속된 모든 소속을 알려줄게.',
	cooldown: 5000,
	options: [{
		name: '이름',
		description: '알아볼 소속의 이름을 입력해.',
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
			let campName = interaction.options.getString("이름");
			if (!campName) return interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`이름을 찾을 수 없어.\`\`\`\n` + text.UISrcIssue).setColor(text.UIColourMiyabi)] });

			await axios.get(`https://zenlessdata.web.app/upload/community/data/zenless/${campName}/camp/ko-kr.json`).then(async (campData) => {
				const Embed = new EmbedBuilder()
					.setTitle(campData.data.ZZZCamp.camp_info[0].camp_name)
					.setDescription('> ' + campData.data.ZZZCamp.camp_info[0].camp_desc)
					.setColor(campData.data.ZZZCamp.camp_info[0].camp_original_color)
					.setImage(campData.data.ZZZCamp.camp_info[0].camp_banner)
					.setThumbnail(campData.data.ZZZCamp.camp_info[0].camp_logo)
					.setFields({ name: "소속된 에이전트", value: campData.data.ZZZCamp.camp_info[1].camp_character.map(agents => `— ${agents}`).join('\n') })
				await interaction.reply({ embeds: [Embed] })
				console.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
			})
		} catch (err) {
			interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.UISrcIssue).setColor(text.UIColourMiyabi)], components: [] })
		}
	}
}