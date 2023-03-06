const {
	CommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder,
	StringSelectMenuBuilder,
	ActionRowBuilder,
} = require("discord.js");
const axios = require("axios");
const db = require("../../database/user.js");
const logger = require("../../events/core/logger.js");
const { MiyabiColor } = require("../../database/color.js");
const text = require("../../database/ko-kr.js");
const { findOneAgent } = require("../../database/agents");

module.exports = {
	name: "에이전트",
	description: "캐릭터의 모든 정보를 알려줄게",
	timeout: 5000,
	options: [{
		name: "이름",
		description: "에이전트 이름을 입력해",
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
		try {
			const matchedAgent = findOneAgent(name)
			await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${matchedAgent}.json`).then(data => {
				const Embed = new EmbedBuilder()
					.setAuthor({ name: data.data.name + " - " + text.UIAgentInfo })
					.setColor(data.data.colour)
					.setDescription(data.data.title)
					.setFields(
						{
							name: "ㅤ",
							value: `**${text.UIAgentName}**: ${data.data.name}\n**${text.UIAgentGender}**: ${data.data.gender}\n**${text.UIAgentBirthDay}**: ██월 ██일`,
							inline: true
						},
						{
							name: "ㅤ",
							value: `**${text.UIAgentCamp}**: ${data.data.camp}\n**${text.UIAgentAttribute}**: ██\n**${text.UIAgentAttack}**: ███`,
							inline: true
						},
						{
							name: "ㅤ",
							value: `${text.UIAgentJapaneseVA} **일본어**: ${data.data.cv.japanese}\n${text.UIAgentChineseVA} **중국어**: ${data.data.cv.chinese}`,
							inline: false
						},
						{
							name: "ㅤ",
							value: `${data.data.interview}\n\n${data.data.intro}`,
							inline: false
						}
					)
					.setThumbnail(data.data.archive.avatar)
				const row = new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId("AgentSelect")
						.setPlaceholder(text.UIPlaceholderForAgent)
						.setMaxValues(1)
						.addOptions([
							{
								label: text.UIAgentInfo,
								value: "Info",
								description: data.data.name + `의 ${text.UIAgentInfo} 알아보기`,
							},
							{
								label: text.UIAgentStats,
								value: "Stats",
								description: data.data.name + `의 ${text.UIAgentStats} 알아보기`,
							},
							{
								label: text.UIAgentBasicAttack,
								value: "BasicAttack",
								description: data.data.name + `의 ${text.UIAgentBasicAttack} 알아보기`,
							},
							{
								label: text.UIAgentSpecialAttack,
								value: "SpecialAttack",
								description: data.data.name + `의 ${text.UIAgentSpecialAttack} 알아보기`,
							},
							{
								label: text.UIAgentComboAttack,
								value: "ComboAttack",
								description: data.data.name + `의 ${text.UIAgentComboAttack} 알아보기`,
							},
							{
								label: text.UIAgentDodge,
								value: "Dodge",
								description: data.data.name + `의 ${text.UIAgentDodge} 알아보기`,
							},
							{
								label: text.UIAgentTalent,
								value: "Talent",
								description: data.data.name + `의 ${text.UIAgentTalent} 알아보기`,
							},
							{
								label: text.UIAgentPartyRecs,
								value: "PartyRecs",
								description: data.data.name + `의 ${text.UIAgentPartyRecs} 알아보기`,
							}
						])
				);
				interaction.reply({ embeds: [Embed], components: [row] })
				addHistory(matchedAgent)
				logger.info(`${interaction.user.id}`);
			})
		} catch (err) {
			if (err.response && err.response.status === 404) {
				interaction.reply({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
			} else {
				console.log(err)
				interaction.reply({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${name}라는 이름을 찾을 수 없어.\`\`\`\n` + "에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
			}
		}

		async function addHistory(matchedAgent) {
			try {
				db.findOne({ user: interaction.user.id }, async (err, userData) => {
					if (err) throw err;
					if (userData) {
						db.updateOne({ user: interaction.user.id }, { $set: { nowcharacter: matchedAgent } })
							.catch(err => logger.error(err));
					} else {
						new db({ since: Date.now(), user: interaction.user.id, nowcharacter: matchedAgent })
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