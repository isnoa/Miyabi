const {
	CommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder,
	StringSelectMenuBuilder,
	ActionRowBuilder,
} = require("discord.js");
const axios = require("axios");
const db = require("../../database/user");
const { MiyabiColor } = require("../../database/color")
const logger = require("../../events/core/logger");

module.exports = {
	name: "character",
	name_localizations: {
		"ko": "캐릭터",
		"ja": "キャラクター"
	},
	description: "I'll give you all the information about the character.",
	description_localizations: {
		"ko": "캐릭터의 모든 정보를 알려줄게",
		"ja": "キャラクターのすべての情報を教えてあげる"
	},
	timeout: 5000,
	options: [{
		name: "name",
		name_localizations: {
			"ko": "이름",
			"ja": "名前"
		},
		description: "Enter a character name.",
		description_localizations: {
			"ko": "캐릭터 이름을 입력해",
			"ja": "キャラクター名を入力して"
		},
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
		const name = interaction.options.getString("name");
		try {
			const text = require("../../database/ko-kr")
			const { findOneCharacter } = require("../../database/characters")
			const matchedCharacter = findOneCharacter(name)
			await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${matchedCharacter}.json`).then(data => {
				const Embed = new EmbedBuilder()
					.setAuthor({ name: text.Character_title_info })
					.setColor(data.data.colour)
					.setDescription(data.data.title)
					.setFields(
						{
							name: "ㅤ",
							value: `**${text.Character_value_name}**: ${data.data.name}\n**${text.Character_value_gender}**: ${data.data.gender}\n**${text.Character_label_bday}**: ██월 ██일`,
							inline: true
						},
						{
							name: "ㅤ",
							value: `**${text.Character_value_camp}**: ${data.data.camp}\n**${text.Character_value_element}**: ██\n**${text.Character_value_attack}**: ███`,
							inline: true
						},
						{
							name: "ㅤ",
							value: `${data.data.interview}\n\n${data.data.intro}`
						}
					)
					.setThumbnail(data.data.archive.avatar)

				const row = new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId("character-select")
						.setPlaceholder(text.Character_placeholder_text)
						.setMaxValues(1)
						.addOptions([
							{
								label: text.Character_label_info,
								value: "Info",
								description: data.data.name + `의 ${text.Character_label_info} 알아보기`,
							},
							{
								label: text.Character_label_stats,
								value: "Stats",
								description: data.data.name + `의 ${text.Character_label_stats} 알아보기`,
							},
							{
								label: text.Character_label_basicAttack,
								value: "BasicAttack",
								description: data.data.name + `의 ${text.Character_label_basicAttack} 알아보기`,
							},
							{
								label: text.Character_label_specialAttack,
								value: "SpecialAttack",
								description: data.data.name + `의 ${text.Character_label_specialAttack} 알아보기`,
							},
							{
								label: text.Character_label_comboAttack,
								value: "ComboAttack",
								description: data.data.name + `의 ${text.Character_label_comboAttack} 알아보기`,
							},
							{
								label: text.Character_label_dodge,
								value: "Dodge",
								description: data.data.name + `의 ${text.Character_label_dodge} 알아보기`,
							},
							{
								label: text.Character_label_talent,
								value: "Talent",
								description: data.data.name + `의 ${text.Character_label_talent} 알아보기`,
							},
							{
								label: text.Character_label_partyRecs,
								value: "PartyRecs",
								description: data.data.name + `의 ${text.Character_label_partyRecs} 알아보기`,
							}
						])
				);
				interaction.reply({ embeds: [Embed], components: [row] })
				addHistory(matchedCharacter)
			})
		} catch (err) {
			if (err.response && err.response.status === 404) {
				interaction.reply({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
			} else {
				console.log(err)
				interaction.reply({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${name}라는 이름을 찾을 수 없어.\`\`\`\n` + "에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
			}
		}

		async function addHistory(matchedCharacter) {
			try {
				db.findOne({ user: interaction.user.id }, async (err, userData) => {
					if (err) throw err;
					if (userData) {
						db.updateOne({ user: interaction.user.id }, { $set: { nowcharacter: matchedCharacter } })
							.catch(err => logger.error(err));
					} else {
						new db({ since: Date.now(), user: interaction.user.id, nowcharacter: matchedCharacter })
							.save().catch(err => logger.error(err));
					}
				})
			} catch (err) {
				console.error(err)
				logger.error(err)
			}
		}
	}
}