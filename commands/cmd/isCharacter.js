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

module.exports = {
	name: "character",
	name_localizations: {
		"ko": "캐릭터",
		"ja": "キャラクター"
	},
	description: "Find more information about the characters in 「Zenless Zone Zero」",
	description_localizations: {
		"ko": "「Zenless Zone Zero」의 캐릭터에 대한 더 많은 정보를 찾아볼 수 있습니다",
		"ja": "「Zenless Zone Zero」のキャラクターに関するより多くの情報を見ることができます"
	},
	timeout: 5000,
	options: [{
		name: "name",
		name_localizations: {
			"ko": "이름",
			"ja": "名前"
		},
		description: "Please enter a name for the character",
		description_localizations: {
			"ko": "캐릭터의 이름을 입력해 주세요",
			"ja": "キャラクターの名前を入力してください"
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
							.setTitle("정보")
							.setColor(data.data.colour)
							.setDescription(' ' + data.data.title)
							.setFields(
								{
									name: "ㅤ",
									value: `ㅤ**이름**: ${data.data.name}\nㅤ**성별**: ${data.data.gender}\nㅤ**생일**: ██월 ██일`,
									inline: true
								},
								{
									name: "ㅤ",
									value: `ㅤ**소속**: ${data.data.camp}\nㅤ**속성**: ██\nㅤ**체계**: ███`,
									inline: true
								},
								{
									name: "ㅤ",
									value: ` ${data.data.intro}\n\n ${data.data.interview}`
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
									.catch(err => console.error(err));
							}
						})
					} catch {
						console.error(err)
					}
				}
			} else {
				interaction.reply({ content: "언어 설정하면 해결될지어다" })
			}
		})
	}
}