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

		db.findOne({ user: interaction.user.id }, async (err, userData) => {
			if (err) throw err;
			if (userData) {
				try {
					const { findOneCharacter } = require("../../database/characters")
					const matchOneCharacter = findOneCharacter(name)
					await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${matchOneCharacter}.json`).then(data => {
						const Embed = new EmbedBuilder()
							.setAuthor({ name: "정보" })
							.setColor(data.data.colour)
							.setDescription(data.data.title)
							.setFields(
								{
									name: "ㅤ",
									value: `**이름**: ${data.data.name}\n**성별**: ${data.data.gender}\n**생일**: ██월 ██일`,
									inline: true
								},
								{
									name: "ㅤ",
									value: `**소속**: ${data.data.camp}\n**속성**: ██\n**공격**: ███`,
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
								.setPlaceholder(`옵션을 선택해.`)
								.setMaxValues(1)
								.addOptions([
									{
										label: "정보",
										value: "Info",
										description: data.data.name + "의 정보 알아보기",
									},
									{
										label: "스텟",
										value: "BaseStats",
										description: data.data.name + "의 스텟 알아보기",
									},
									{
										label: "기본공격",
										value: "BasicAttack",
										description: data.data.name + "의 기본공격 알아보기",
									},
									{
										label: "특수공격",
										value: "SpecialAttack",
										description: data.data.name + "의 특수공격 알아보기",
									},
									{
										label: "연계공격",
										value: "ComboAttack",
										description: data.data.name + "의 연계공격 알아보기",
									},
									{
										label: "회피",
										value: "Dodge",
										description: data.data.name + "의 회피 알아보기",
									},
									{
										label: "특성",
										value: "Talent",
										description: data.data.name + "의 특성 알아보기",
									},
									{
										label: "추천파티",
										value: "PartyRecs",
										description: data.data.name + "의 추천파티 알아보기",
									}
								])
						);
						interaction.reply({ embeds: [Embed], components: [row] })
						addHistory(matchOneCharacter)
					})
				} catch (err) {
					if (err.response && err.response.status === 404) {
						interaction.reply({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
					} else {
						interaction.reply({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${name}라는 이름을 찾을 수 없어.\`\`\`\n` + "에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
					}
				}

				async function addHistory(matchOneCharacter) {
					try {
						db.findOne({ user: interaction.user.id }, async (err, userData) => {
							if (err) throw err;
							if (userData) {
								db.updateOne({ user: interaction.user.id }, { $set: { nowcharacter: matchOneCharacter } })
									.catch(err => logger.error(err));
							}
						})
					} catch (err) {
						console.error(err)
						logger.error(err)
					}
				}
			} else {
				interaction.reply({ content: "언어 설정하면 해결될지어다" })
			}
		})
	}
}