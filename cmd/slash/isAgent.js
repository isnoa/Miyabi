'use strict';
const {
	CommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder,
	StringSelectMenuBuilder,
	ActionRowBuilder,
	ComponentType
} = require("discord.js");
const axios = require("axios");
const db = require("../../database/user.js");
const logger = require("../../events/core/logger.js");
const { MiyabiColor } = require("../../database/color.js");
const text = require("../../database/ko-kr.js");
const { findOneAgent } = require("../../database/agents.js");

module.exports = {
	name: "에이전트",
	description: "캐릭터의 모든 정보를 알려줄게",
	cooldown: 5000,
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
	 */
	run: async (client, interaction) => {
		try {
			let name = interaction.options.getString("이름");
			let matchedAgent = findOneAgent(name)
			if (matchedAgent === undefined) return interaction.reply({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${name}라는 이름을 찾을 수 없어.\`\`\`\n` + text.UISrcIssue).setColor(MiyabiColor)] });
			await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${matchedAgent}.json`).then(async (agent) => {
				const Embed = new EmbedBuilder()
					.setTitle(text.UIAgentInfo)
					.setColor(agent.data.colour)
					.setDescription(replaceDescription(matchedAgent, agent))
					.setFields(
						{
							name: text.UIAgentNomalInfo,
							value: `${text.UIAgentName}: ${agent.data.name}\n${text.UIAgentGender}: ${agent.data.gender}\n${text.UIAgentBirthDay}: ██월 ██일\n${text.UIAgentCamp}: ${agent.data.camp}`,
							inline: true
						},
						{
							name: text.UIAgentBattleInfo,
							value: `${text.UIAgentDamageAttribute}: 얼음\n${text.UIAgentAttackAttribute}: 베기\n→ *에테리얼류(상성)*`,
							inline: true
						},
						{
							name: text.UIAgentInterviewAndIntroduction,
							value: `${agent.data.interview}\n\n${agent.data.intro}`,
							inline: false
						}
					)
					.setThumbnail(agent.data.archive.avatar)

				interaction.reply({ embeds: [Embed], components: [selectAgentRow()] })





				/////////////////////////////////////////////////////
				// INTERACTION COLLECTOR ////////////////////////////
				/////////////////////////////////////////////////////
				const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 30_000 });

				collector.on('collect', async (i) => {
					if (!(i.user.id === interaction.user.id)) return i.reply({ content: "남의 것을 뺴앗는건 질서를 무너뜨리는 행동이야.", ephemeral: true })
					let lastagent = client.agent.get(`lastagent${i.user.id}`)
					let option = i.values[0];
					await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${matchedAgent}.json`).then(async (agent) => {
						if (option === 'Info') {
							const Embed = new EmbedBuilder()
								.setTitle(text.UIAgentInfo)
								.setColor(agent.data.colour)
								.setDescription(replaceDescription(matchedAgent = lastagent, agent))
								.setFields(
									{
										name: "—기본 정보",
										value: `${text.UIAgentName}: ${agent.data.name}\n${text.UIAgentGender}: ${agent.data.gender}\n${text.UIAgentBirthDay}: ██월 ██일\n${text.UIAgentCamp}: ${agent.data.camp}`,
										inline: true
									},
									{
										name: "—전투 정보",
										value: `${text.UIAgentDamageAttribute}: 얼음\n${text.UIAgentAttackAttribute}: 베기\n→ *에테리얼류(상성)*`,
										inline: true
									},
									{
										name: "—인터뷰 & 소개",
										value: `${agent.data.interview}\n\n${agent.data.intro}`,
										inline: false
									}
								)
								.setThumbnail(agent.data.archive.avatar)
							await i.update({ embeds: [Embed], components: [selectAgentRow()] })
						}
					})
					collector.on('end', collected => i.editReply({ components: [] }))
				})
			})

			addHistory(matchedAgent)
			logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);

		} catch (err) {
			console.log(err)
			// interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.UISrcIssue).setColor(MiyabiColor)], components: [] })
		}





		/////////////////////////////////////////////////////
		// ADDITIONAL FUNCTIONS /////////////////////////////
		/////////////////////////////////////////////////////
		function replaceDescription(matchedAgent, agent) {
			switch (matchedAgent) {
				case "soukaku":
					return `> ${(agent.data.title).replace(/\n/i, " ").replace(/면/i, "면\n>")}`;
				case "ben_bigger":
					return `> ${(agent.data.title).replace(/\n/i, " ").replace(/을/i, "을\n>")}`;
				default:
					return `> ${(agent.data.title).replace(/\n/i, "\n> ")}`;
			}
		}

		function selectAgentRow() {
			const row = new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId("selectAgent")
					.setPlaceholder(text.UIPlaceholderForAgent)
					.setMaxValues(1)
					.addOptions([
						{ label: text.UIAgentInfo, value: "Info" },
						{ label: text.UIAgentStats, value: "Stats" },
						{ label: text.UIAgentBasicAttack, value: "BasicAttack" },
						{ label: text.UIAgentSpecialAttack, value: "SpecialAttack" },
						{ label: text.UIAgentComboAttack, value: "ComboAttack" },
						{ label: text.UIAgentDodge, value: "Dodge" },
						{ label: text.UIAgentTalent, value: "Talent" },
						{ label: text.UIAgentPartyRecs, value: "PartyRecs" }
					])
			);
			return row;
		}

		/**
		 * Saving Agent Request History
		 * @param {String} matchedAgent - Get matchedAgent Value
		 * @return Stored in database and collection
		 */
		function addHistory(matchedAgent) {
			db.findOne({ userId: interaction.user.id }).then(async (user) => {
				if (user) {
					db.updateOne({ userId: interaction.user.id }, { $set: { lastAgent: matchedAgent } })
						.catch(err => logger.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));

					const agent = client.agent
					if (agent.has(`lastagent${interaction.user.id}`)) {
						if (agent.has(`lastagent${interaction.user.id}`) === matchedAgent) {
							await agent.clear(`lastagent${interaction.user.id}`)
							await agent.set(`lastagent${interaction.user.id}`, matchedAgent)
						} else {
							agent.set(`lastagent${interaction.user.id}`, matchedAgent)
						}
					}
				} else {
					new db({ userId: interaction.user.id, lastAgent: matchedAgent })
						.save().catch(err => logger.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
				}
			}).catch((err) => {
				if (err) throw err;
			})
		}
	}
}