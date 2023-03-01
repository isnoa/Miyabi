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
} = require("../../database/links");

module.exports = {
	name: '소속',
	description: '캐릭터가 소속된 모든 소속을 알려줄게',
	options: [{
		name: '이름',
		description: '알아볼 소속의 이름을 입력해',
		type: ApplicationCommandOptionType.String,
		required: true,
		autocomplete: true
	}],
	timeout: 5000,
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
					const name = data.data.ZZZCamp.camp_info[0].camp_name
					const desc = data.data.ZZZCamp.camp_info[0].camp_desc
					const banner = data.data.ZZZCamp.camp_info[0].camp_banner
					const logo = data.data.ZZZCamp.camp_info[0].camp_logo
					const color = data.data.ZZZCamp.camp_info[0].camp_original_color

					const character_first = data.data.ZZZCamp.camp_info[1].character[0]
					const character_second = data.data.ZZZCamp.camp_info[1].character[1]
					const character_third = data.data.ZZZCamp.camp_info[1].character[2]
					const character_fourth = data.data.ZZZCamp.camp_info[1].character[3]

					const Embed = new EmbedBuilder()
						.setAuthor({ name: name })
						.setImage(banner)
						.setThumbnail(logo)
						.setDescription(desc)
						.setColor(color)
						.setFields({ name: "소속된 캐릭터", value: `${character_first}\n${character_second || ""}\n${character_third || ""}\n${character_fourth || ""}` })

					// if (character_first) {
					// 	Embed.setFields(
					// 		{ name: "ㅤ", value: character_first, inline: false }
					// 	)
					// } if (character_second) {
					// 	Embed.setFields(
					// 		{ name: "ㅤ", value: character_first, inline: false },
					// 		{ name: "ㅤ", value: character_second, inline: false }
					// 	)
					// } else if (character_third) {
					// 	Embed.setFields(
					// 		{ name: "ㅤ", value: character_first, inline: false },
					// 		{ name: "ㅤ", value: character_second, inline: false },
					// 		{ name: "ㅤ", value: character_third, inline: false }
					// 	)
					// } else if (character_fourth) {
					// 	Embed.setFields(
					// 		{ name: "ㅤ", value: character_first, inline: false },
					// 		{ name: "ㅤ", value: character_second, inline: false },
					// 		{ name: "ㅤ", value: character_third, inline: false },
					// 		{ name: "ㅤ", value: character_fourth, inline: false }
					// 	)
					// }

					interaction.reply({ embeds: [Embed] })
					return true;
				})
			} catch {
				return undefined;
			}
		}
	}
}