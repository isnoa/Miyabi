const { CommandInteraction, ApplicationCommandOptionType, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, InteractionType } = require("discord.js");
const axios = require("axios");
const db = require("../../database/user");
const {
    gentle_camp,
    unknown_camp,
    victoria_camp,
    belobog_camp
} = require("../../database/links");

module.exports = {
	name: 'camp',
	description: 'None',
	timeout: 5000,
	options: [{
		name: '이름',
		description: '알아볼 소속의 이름을 입력해 주세요',
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
		db.findOne({ user: interaction.user.id }, async (err, userData) => {
			if (err) throw err;
			if (userData) {
				if (name == "교활한 토끼굴") {
					var URL = gentle_camp
					generateObject(URL)
				} else if (name == "소속 불명") {
					var URL = unknown_camp
					generateObject(URL)
				} else if (name == "빅토리아 홈서비스") {
					var URL = victoria_camp
					generateObject(URL)
				} else if (name == "벨로보그 중공업") {
					var URL = belobog_camp
					generateObject(URL)
				} else if (name == "대공동 6과") {
					var URL = section_camp
					generateObject(URL)
				}

				async function generateObject(URL) {
					try {
						await axios.get(URL).then(data => {
							var name = data.data.ZZZCamp.camp_info[0].camp_name
							var desc = data.data.ZZZCamp.camp_info[0].camp_desc
							var banner = data.data.ZZZCamp.camp_info[0].camp_banner
							var logo = data.data.ZZZCamp.camp_info[0].camp_logo
							var color = data.data.ZZZCamp.camp_info[0].camp_original_color
							
							var character = data.data.ZZZCamp.camp_info[1].camp_character[0]
							var character_second = data.data.ZZZCamp.camp_info[1].camp_character[1] || 'COMING SOON'
							var character_third = data.data.ZZZCamp.camp_info[1].camp_character[2] || 'COMING SOON'
							var character_fourth = data.data.ZZZCamp.camp_info[1].camp_character[3] || 'COMING SOON'

							// 임베드
							const Embed = new EmbedBuilder()
								.setAuthor({ name: name })
								.setImage(banner)
								.setThumbnail(logo)
								.setDescription(desc)
								.setColor(color)
								.setFields(
									{
										name: character,
										value: 'COMING SOON'
									},
									{
										name: character_second,
										value: 'COMING SOON'
									},
									{
										name: character_third,
										value: 'COMING SOON'
									},
									{
										name: character_fourth,
										value: 'COMING SOON'
									}
								)

							interaction.reply({ embeds: [Embed] })
							return true;
						})
					} catch {
						return false;
					}
				}
			}
		})
	}
}