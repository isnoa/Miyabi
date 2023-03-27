const {
	CommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder
} = require("discord.js");
const axios = require("axios");
const {
	gentle_camp,
	unknown_camp,
	victoria_camp,
	belobog_camp
} = require("../../database/links.js");
const logger = require("../../events/core/logger.js");

module.exports = {
	name: '소속',
	description: '캐릭터가 소속된 모든 소속을 알려줄게',
	timeout: 5000,
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
		const name = interaction.options.getString("이름");
		if (name == "교활한 토끼굴") {
			const URL = gentle_camp
			generateObject(URL)
		} else if (name == "소속 불명") {
			const URL = unknown_camp
			generateObject(URL)
		} else if (name == "빅토리아 홈서비스") {
			const URL = victoria_camp
			generateObject(URL)
		} else if (name == "벨로보그 중공업") {
			const URL = belobog_camp
			generateObject(URL)
		} else if (name == "대공동 6과") {
			const URL = section_camp
			generateObject(URL)
		}

		async function generateObject(URL) {
			try {
				await axios.get(URL).then(data => {
					const character_first = data.data.ZZZCamp.camp_info[1].character[0]
					const character_second = data.data.ZZZCamp.camp_info[1].character[1]
					const character_third = data.data.ZZZCamp.camp_info[1].character[2]
					const character_fourth = data.data.ZZZCamp.camp_info[1].character[3]

					const Embed = new EmbedBuilder()
						.setAuthor({ name: data.data.ZZZCamp.camp_info[0].camp_name })
						.setImage(data.data.ZZZCamp.camp_info[0].camp_banner)
						.setThumbnail(data.data.ZZZCamp.camp_info[0].camp_logo)
						.setDescription(data.data.ZZZCamp.camp_info[0].camp_desc)
						.setColor(data.data.ZZZCamp.camp_info[0].camp_original_color)
						.setFields({ name: "소속된 캐릭터", value: `${character_first}\n${character_second ?? ""}\n${character_third ?? ""}\n${character_fourth ?? ""}` })

					// if (character_first) {
					// 	Embed.setFields(
					// 		{ name: "\u200B", value: character_first, inline: false }
					// 	)
					// } if (character_second) {
					// 	Embed.setFields(
					// 		{ name: "\u200B", value: character_first, inline: false },
					// 		{ name: "\u200B", value: character_second, inline: false }
					// 	)
					// } else if (character_third) {
					// 	Embed.setFields(
					// 		{ name: "\u200B", value: character_first, inline: false },
					// 		{ name: "\u200B", value: character_second, inline: false },
					// 		{ name: "\u200B", value: character_third, inline: false }
					// 	)
					// } else if (character_fourth) {
					// 	Embed.setFields(
					// 		{ name: "\u200B", value: character_first, inline: false },
					// 		{ name: "\u200B", value: character_second, inline: false },
					// 		{ name: "\u200B", value: character_third, inline: false },
					// 		{ name: "\u200B", value: character_fourth, inline: false }
					// 	)
					// }

					interaction.reply({ embeds: [Embed] })
					logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Request Values: [${name}] || Interaction Latency: [${Math.abs(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
				})
			} catch (err) {
				interaction.reply({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${name}라는 이름을 찾을 수 없어.\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
				logger.error(err)
			}
		}
	}
}