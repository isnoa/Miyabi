const {
	CommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder
} = require("discord.js");
const axios = require("axios");
const { MiyabiColor } = require("../../database/color.js");
const logger = require("../../events/core/logger.js");
const { findOneCamp } = require("../../database/camps.js");

module.exports = {
	name: '소속',
	description: '캐릭터가 소속된 모든 소속을 알려줄게',
	cooldown: 5000,
	options: [{
		name: '이름',
		description: '알아볼 소속의 이름을 입력해',
		type: ApplicationCommandOptionType.String,
		required: true,
		autocomplete: true
	}],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		try {
			const name = interaction.options.getString("이름");
			const matchedCamp = findOneCamp(name)
			if (matchedCamp === undefined) return interaction.reply({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${name}라는 이름을 찾을 수 없어.\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)] });
			await axios.get(matchedCamp).then(camp => {
				const Embed = new EmbedBuilder()
					.setTitle(camp.data.ZZZCamp.camp_info[0].camp_name)
					.setImage(camp.data.ZZZCamp.camp_info[0].camp_banner)
					.setThumbnail(camp.data.ZZZCamp.camp_info[0].camp_logo)
					.setDescription('> ' + camp.data.ZZZCamp.camp_info[0].camp_desc)
					.setColor(camp.data.ZZZCamp.camp_info[0].camp_original_color)
					.setFields({ name: "소속된 에이전트", value: camp.data.ZZZCamp.camp_info[1].camp_character.map(c => `— ${c}`).join('\n') })
				interaction.reply({ embeds: [Embed] })
				logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Request Values: [${name}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
			})
		} catch (err) { interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] }) }
	}
}