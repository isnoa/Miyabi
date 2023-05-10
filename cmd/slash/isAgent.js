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
const { MiyabiColor } = require("../../database/color.js");
const text = require("../../database/ko-kr.js");
const { findOneAgent } = require("../../database/agents.js");

module.exports = {
	name: "에이전트",
	description: "캐릭터의 모든 정보를 알려줄게",
	cooldown: 30000,
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
			if (!matchedAgent) return interaction.reply({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${name}라는 이름을 찾을 수 없어.\`\`\`\n` + text.UISrcIssue).setColor(MiyabiColor)] });
			await addHistory(matchedAgent)
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
				await interaction.reply({ embeds: [Embed], components: [selectAgentRow()] })
					.then(setTimeout(() => {
						interaction.editReply({ components: [] })
						collector.stop("I'd care. this act's reason")
					}, 30000));
			})






			/////////////////////////////////////////////////////
			// INTERACTION COLLECTOR ////////////////////////////
			/////////////////////////////////////////////////////
			const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 31000 });

			collector.on('collect', async (i) => {
				if (!(i.user.id === interaction.user.id)) return i.reply({ content: "남의 것을 뺴앗는건 질서를 무너뜨리는 행위야.", ephemeral: true })
				let matchedAgent = client.agent.get(`lastagent${i.user.id}`)
				let option = i.values[0];
				await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${matchedAgent}.json`).then(async (agent) => {
					switch (option) {
						case 'Info':
							const InfoEmbed = new EmbedBuilder()
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
							await i.update({ embeds: [InfoEmbed], components: [selectAgentRow()] })
							break;
						case 'Stats':
							const StatsEmbed = new EmbedBuilder()
								.setTitle(agent.data.name + " — " + text.UIAgentStats)
								.setColor(agent.data.colour)
								.setFields(
									{
										name: text.UIAgentEXCriteria,
										value: text.UIAgentMAXLvCriteria,
										inline: false
									},
									{
										name: text.UIAgentNecessaryArticles,
										value: ` · ${text.UIAgentMaterial}·${agent.data.name}: ?\n · ${text.UIAgentAgentArchive}: ?`,
										inline: false
									},
									{
										name: text.UIAgentCompare,
										value: `${text.FIGHT_PROP_HP}: 462 → 5164\n${text.FIGHT_PROP_ATK}: 101 → 1132\n${text.FIGHT_PROP_DEF}: 48 → 567\n${text.FIGHT_PROP_IMPACT}: 110 → 121\n${text.FIGHT_PROP_CRITICAL_RATE}: 5% → 10%\n${text.FIGHT_PROP_CRITICAL_DMG}: 50% → 50%\n${text.FIGHT_PROP_PENETRATION_RATIO}: 0% → 0%\n${text.FIGHT_PROP_PENETRATION}: 0 → 3%\n${text.FIGHT_PROP_ENERGY_RECOVERY}: 1.8 → 1.86`,
										inline: false
									}
								)
								.setThumbnail(agent.data.archive.avatar)
							await i.update({ embeds: [StatsEmbed], components: [selectAgentRow()] })
							break;
						case 'BasicAttack':
							const Embed = new EmbedBuilder()
								.setTitle(agent.data.name + " — " + text.UIAgentBasicAttack)
								.setColor(agent.data.colour)
								.setDescription("해당 캐릭터의 추천 순위는 1st, 2nd, 3rd 순이랍니다.")
								.setFields(
									{
										name: "—",
										value: "> 호시미 미야비\n소우카쿠\n빌리 키드",
										inline: false
									},
									{
										name: "—",
										value: "> 호시미 미야비\n소우카쿠\n코린 위크스",
										inline: false
									},
									{
										name: "—",
										value: "> 호시미 미야비\n소우카쿠\n앤톤 이바노프",
										inline: false
									}
								)
								.setThumbnail(agent.data.archive.avatar)
							await i.update({ embeds: [Embed], components: [selectAgentRow()] })
							break;
						case 'SpecialAttack':
							const SpecialAttackEmbed = new EmbedBuilder()
								.setTitle(agent.data.name + " — " + text.UIAgentDodge)
								.setColor(agent.data.colour)
								.setDescription("해당 캐릭터의 추천 순위는 1st, 2nd, 3rd 순이랍니다.")
								.setFields(
									{
										name: "1st (호소빌)",
										value: "> 호시미 미야비\n소우카쿠\n빌리 키드",
										inline: true
									},
									{
										name: "2nd (호소코)",
										value: "> 호시미 미야비\n소우카쿠\n코린 위크스",
										inline: true
									},
									{
										name: "3rd (호소앤)",
										value: "> 호시미 미야비\n소우카쿠\n앤톤 이바노프",
										inline: true
									}
								)
								.setThumbnail(agent.data.archive.avatar)
							await i.update({ embeds: [SpecialAttackEmbed], components: [selectAgentRow()] })
							break;
						case 'ComboAttack':
							const ComboAttackEmbed = new EmbedBuilder()
								.setTitle(agent.data.name + " — " + text.UIAgentDodge)
								.setColor(agent.data.colour)
								.setDescription("해당 캐릭터의 추천 순위는 1st, 2nd, 3rd 순이랍니다.")
								.setFields(
									{
										name: "1st (호소빌)",
										value: "> 호시미 미야비\n소우카쿠\n빌리 키드",
										inline: true
									},
									{
										name: "2nd (호소코)",
										value: "> 호시미 미야비\n소우카쿠\n코린 위크스",
										inline: true
									},
									{
										name: "3rd (호소앤)",
										value: "> 호시미 미야비\n소우카쿠\n앤톤 이바노프",
										inline: true
									}
								)
								.setThumbnail(agent.data.archive.avatar)
							await i.update({ embeds: [ComboAttackEmbed], components: [selectAgentRow()] })
							break;
						case 'Dodge':
							const DodgeEmbed = new EmbedBuilder()
								.setTitle(agent.data.name + " — " + text.UIAgentDodge)
								.setColor(agent.data.colour)
								.setDescription("해당 캐릭터의 추천 순위는 1st, 2nd, 3rd 순이랍니다.")
								.setFields(
									{
										name: "1st (호소빌)",
										value: "> 호시미 미야비\n소우카쿠\n빌리 키드",
										inline: true
									},
									{
										name: "2nd (호소코)",
										value: "> 호시미 미야비\n소우카쿠\n코린 위크스",
										inline: true
									},
									{
										name: "3rd (호소앤)",
										value: "> 호시미 미야비\n소우카쿠\n앤톤 이바노프",
										inline: true
									}
								)
								.setThumbnail(agent.data.archive.avatar)
							await i.update({ embeds: [DodgeEmbed], components: [selectAgentRow()] })
							break;
						case 'Talent':
							const TalentEmbed = new EmbedBuilder()
								.setTitle(agent.data.name + " — " + text.UIAgentTalent)
								.setColor(agent.data.colour)
								.setDescription("해당 캐릭터의 추천 순위는 1st, 2nd, 3rd 순이랍니다.")
								.setFields(
									{
										name: "1st (호소빌)",
										value: "> 호시미 미야비\n소우카쿠\n빌리 키드",
										inline: true
									},
									{
										name: "2nd (호소코)",
										value: "> 호시미 미야비\n소우카쿠\n코린 위크스",
										inline: true
									},
									{
										name: "3rd (호소앤)",
										value: "> 호시미 미야비\n소우카쿠\n앤톤 이바노프",
										inline: true
									}
								)
								.setThumbnail(agent.data.archive.avatar)
							interaction.update({ embeds: [TalentEmbed], components: [selectAgentRow()] })
							break;
						case 'PartyRecs':
							const PartyRecsEmbed = new EmbedBuilder()
								.setTitle(agent.data.name + " — " + text.UIAgentPartyRecs)
								.setColor(agent.data.colour)
								.setDescription(text.UIAgentOrderOfTier)
								.setFields(
									{
										name: `${text.UIAgentTierOrder1st} — 호소빌`,
										value: "> 호시미 미야비\n> 소우카쿠\n> 빌리 키드",
										inline: true
									},
									{
										name: `${text.UIAgentTierOrder2nd} — 호소코`,
										value: "> 호시미 미야비\n> 소우카쿠\n> 코린 위크스",
										inline: true
									},
									{
										name: `${text.UIAgentTierOrder3rd} — 호소앤`,
										value: "> 호시미 미야비\n> 소우카쿠\n> 앤톤 이바노프",
										inline: true
									}
								)
								.setThumbnail(agent.data.archive.avatar)
							interaction.update({ embeds: [PartyRecsEmbed], components: [selectAgentRow()] })
							break;
					}
				})
				collector.on('end', (collected, reason) => {
					console.log(`Collected ${collected.size}, ${reason} items`);
				});
			})
			consoleinfo(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);

		} catch (err) {
			interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.UISrcIssue).setColor(MiyabiColor)], components: [] })
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

		function UIAgentGoSite(agent, req) {
			let response = `https://randomplay.miray.me/character/datail/${agent.data.detail_id}/#${req}`
			return `**[*](${response} '더 자세히 알아보기')**`;
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
		 * @param {String} matchedAgent Get matchedAgent Value
		 * @return Stored in database and collection
		 */
		async function addHistory(matchedAgent) {
			db.findOne({ userId: interaction.user.id }).then(async (user) => {
				if (user) {
					db.updateOne({ userId: interaction.user.id }, { $set: { lastAgent: matchedAgent } })
						.catch(err => console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));

					const agent = client.agent
					if (agent.has(`lastagent${interaction.user.id}`)) {
						await agent.clear(`lastagent${interaction.user.id}`)
						await agent.set(`lastagent${interaction.user.id}`, matchedAgent)
					} else {
						await agent.set(`lastagent${interaction.user.id}`, matchedAgent)
					}
				} else {
					new db({ userId: interaction.user.id, lastAgent: matchedAgent })
						.save().catch(err => console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
				}
			}).catch((err) => {
				if (err) throw err;
			})
		}
	}
}