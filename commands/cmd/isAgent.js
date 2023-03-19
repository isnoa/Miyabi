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
const icon = require("../../database/icons.js");
const { findOneAgent } = require("../../database/agents.js");

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
			const matchedAgent = findOneAgent(name)
			if (matchedAgent === undefined) return interaction.reply({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${name}라는 이름을 찾을 수 없어.\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)] });
			await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${matchedAgent}.json`).then(data => {
				const Embed = new EmbedBuilder()
					.setTitle(data.data.name + " - " + text.UIAgentInfo)
					.setColor(data.data.colour)
					.setDescription(data.data.title)
					.setFields(
						{
							name: `${icon.UIExclamationmarkOne} 기본 정보`,
							value: `**${text.UIAgentName}**: ${data.data.name}\n**${text.UIAgentGender}**: ${data.data.gender}\n**${text.UIAgentBirthDay}**: ██월 ██일\n**${text.UIAgentCamp}**: ${data.data.camp}`,
							inline: true
						},
						{
							name: `${icon.UIExclamationmarkTwo} 전투 정보`,
							value: `**${text.UIAgentDamageAttribute}**: 얼음\n**${text.UIAgentAttackAttribute}**: 베기\n→ *에테리얼류(상성)*`,
							inline: true
						},
						{
							name: `${icon.UIMic} 성우 정보`,
							value: `**일본어**: ${data.data.cv.japanese}\n**중국어**: ${data.data.cv.chinese}`,
							inline: true
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
				logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Request Values: [${name}] || Interaction Latency: [${Math.abs(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
			})

		function addHistory(matchedAgent) {
			db.findOne({ user: interaction.user.id }, async (err, userData) => {
				if (err) throw err;
				if (userData) {
					db.updateOne({ user: interaction.user.id }, { $set: { lastcharacter: matchedAgent } })
						.catch(err => logger.error(err));
				} else {
					new db({ timestamp: Date.now(), user: interaction.user.id, lastcharacter: matchedAgent })
						.save().catch(err => logger.error(err));
				}
			})
		}
	}
}