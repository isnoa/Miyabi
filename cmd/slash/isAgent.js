const {
	CommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder,
	StringSelectMenuBuilder,
	ActionRowBuilder,
	ComponentType
} = require("discord.js");
const axios = require("axios");
const text = require("../../events/modules/ko-kr.js");

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
			let agentName = interaction.options.getString("이름");
			if (!agentName) return interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`이름을 찾을 수 없어.\`\`\`\n` + text.UISrcIssue).setColor(text.UIColourMiyabi)] });

			await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${agentName}.json`).then(async (agentData) => {
				const Embed = new EmbedBuilder()
					.setTitle(text.UIAgentInfo)
					.setColor(agentData.data.colour)
					.setDescription(replaceDescription(agentName, agentData))
					.setFields(
						{
							name: text.UIAgentNomalInfo,
							value: `${text.UIAgentName}: ${agentData.data.name}\n${text.UIAgentGender}: ${agentData.data.gender}\n${text.UIAgentBirthDay}: ██월 ██일\n${text.UIAgentCamp}: ${agentData.data.camp}`,
							inline: true
						},
						{
							name: text.UIAgentBattleInfo,
							value: `${text.UIAgentPropDamage}: 얼음\n${text.UIAgentPropAttack}: 베기\n→ *에테리얼류(상성)*`,
							inline: true
						},
						{
							name: text.UIAgentIAIInfo,
							value: `${agentData.data.interview}\n\n${agentData.data.intro}`,
							inline: false
						}
					)
					.setThumbnail(agentData.data.archive.avatar);

				await interaction.reply({ embeds: [Embed], components: [selectAgentRow()] })
					.then(setTimeout(() => {
						interaction.editReply({ components: [] });
						collector.stop();
					}, 30000));
			});







			/////////////////////////////////////////////////////
			// INTERACTION COLLECTOR ////////////////////////////
			/////////////////////////////////////////////////////
			const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 30000 });

			collector.on('collect', async (i) => {
				if (!(i.user.id === interaction.user.id)) return i.reply({ content: "남의 것을 뺴앗는건 질서를 무너뜨리는 행위야.", ephemeral: true })
				let agentName = client.agentName.get(`lastagent${i.user.id}`)
				await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${agentName}.json`).then(async (agentData) => {
					switch (i.values[0]) {
						case 'Info':
							const InfoEmbed = new EmbedBuilder()
								.setTitle(text.UIAgentInfo)
								.setColor(agentData.data.colour)
								.setDescription(replaceDescription(agentName, agentData))
								.setFields(
									{
										name: text.UIAgentNomalInfo,
										value: `${text.UIAgentName}: ${agentData.data.name}\n${text.UIAgentGender}: ${agentData.data.gender}\n${text.UIAgentBirthDay}: ██월 ██일\n${text.UIAgentCamp}: ${agentData.data.camp}`,
										inline: true
									},
									{
										name: text.UIAgentBattleInfo,
										value: `${text.UIAgentPropDamage}: 얼음\n${text.UIAgentPropAttack}: 베기\n→ *에테리얼류(상성)*`,
										inline: true
									},
									{
										name: text.UIAgentIAIInfo,
										value: `${agentData.data.interview}\n\n${agentData.data.intro}`,
										inline: false
									}
								)
								.setThumbnail(agentData.data.archive.avatar)
							await i.update({ embeds: [InfoEmbed], components: [selectAgentRow()] })
							break;
						case 'Stats':
							const StatsEmbed = new EmbedBuilder()
								.setTitle(agentData.data.name + " — " + text.UIAgentStats)
								.setColor(agentData.data.colour)
								.setFields(
									{
										name: text.UIAgentEXIndicator,
										value: text.UIAgentMAXLvCriteria,
										inline: false
									},
									{
										name: text.UIAgentNecessaryArticles,
										value: ` · ${text.UIAgentMaterial}·${agentData.data.name}: ?\n · ${text.UIAgentAgentArchive}: ?`,
										inline: false
									},
									{
										name: text.UIAgentCompare,
										value: `${text.FIGHT_PROP_HP}: 462 → 5164\n${text.FIGHT_PROP_ATK}: 101 → 1132\n${text.FIGHT_PROP_DEF}: 48 → 567\n${text.FIGHT_PROP_IMPACT}: 110 → 121\n${text.FIGHT_PROP_CRITICAL_RATE}: 5% → 10%\n${text.FIGHT_PROP_CRITICAL_DMG}: 50% → 50%\n${text.FIGHT_PROP_PENETRATION_RATIO}: 0% → 0%\n${text.FIGHT_PROP_PENETRATION}: 0 → 3%\n${text.FIGHT_PROP_ENERGY_RECOVERY}: 1.8 → 1.86`,
										inline: false
									}
								)
								.setThumbnail(agentData.data.archive.avatar)
							await i.update({ embeds: [StatsEmbed], components: [selectAgentRow()] })
							break;
						case 'BasicAttack':
							const Embed = new EmbedBuilder()
								.setTitle(agentData.data.name + " — " + text.UIAgentBasicAttack)
								.setColor(agentData.data.colour)
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
								.setThumbnail(agentData.data.archive.avatar)
							await i.update({ embeds: [Embed], components: [selectAgentRow()] })
							break;
						case 'SpecialAttack':
							const SpecialAttackEmbed = new EmbedBuilder()
								.setTitle(agentData.data.name + " — " + text.UIAgentDodge)
								.setColor(agentData.data.colour)
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
								.setThumbnail(agentData.data.archive.avatar)
							await i.update({ embeds: [SpecialAttackEmbed], components: [selectAgentRow()] })
							break;
						case 'ComboAttack':
							const ComboAttackEmbed = new EmbedBuilder()
								.setTitle(agentData.data.name + " — " + text.UIAgentDodge)
								.setColor(agentData.data.colour)
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
								.setThumbnail(agentData.data.archive.avatar)
							await i.update({ embeds: [ComboAttackEmbed], components: [selectAgentRow()] })
							break;
						case 'Dodge':
							const DodgeEmbed = new EmbedBuilder()
								.setTitle(agentData.data.name + " — " + text.UIAgentDodge)
								.setColor(agentData.data.colour)
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
								.setThumbnail(agentData.data.archive.avatar)
							await i.update({ embeds: [DodgeEmbed], components: [selectAgentRow()] })
							break;
						case 'Talent':
							const TalentEmbed = new EmbedBuilder()
								.setTitle(agentData.data.name + " — " + text.UIAgentTalent)
								.setColor(agentData.data.colour)
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
								.setThumbnail(agentData.data.archive.avatar)
							interaction.update({ embeds: [TalentEmbed], components: [selectAgentRow()] })
							break;
						case 'PartyRecs':
							const PartyRecsEmbed = new EmbedBuilder()
								.setTitle(agentData.data.name + " — " + text.UIAgentPartyRecs)
								.setColor(agentData.data.colour)
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
								.setThumbnail(agentData.data.archive.avatar)
							interaction.update({ embeds: [PartyRecsEmbed], components: [selectAgentRow()] })
							break;
					}
				})
			})
			console.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
		} catch (err) {
			interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.UISrcIssue).setColor(text.UIColourMiyabi)], components: [] })
		}





		/////////////////////////////////////////////////////
		// ADDITIONAL FUNCTIONS /////////////////////////////
		/////////////////////////////////////////////////////
		function replaceDescription(agentName, agentData) {
			switch (agentName) {
				case "soukaku":
					return `> ${(agentData.data.title).replace(/\n/i, " ").replace(/면/i, "면\n>")}`;
				case "ben_bigger":
					return `> ${(agentData.data.title).replace(/\n/i, " ").replace(/을/i, "을\n>")}`;
				default:
					return `> ${(agentData.data.title).replace(/\n/i, "\n> ")}`;
			}
		}

		function selectAgentRow() {
			const Row = new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId("selectAgent")
					.setPlaceholder(text.UIPlaceholderForAgent)
					.setMaxValues(1)
					.addOptions([
						{ label: text.UIAgentSelectInfo, value: "Info" },
						{ label: text.UIAgentSelectStats, value: "Stats" },
						{ label: text.UIAgentSelectBasicAttack, value: "BasicAttack" },
						{ label: text.UIAgentSelectSpecialAttack, value: "SpecialAttack" },
						{ label: text.UIAgentSelectComboAttack, value: "ComboAttack" },
						{ label: text.UIAgentSelectDodge, value: "Dodge" },
						{ label: text.UIAgentSelectTalent, value: "Talent" },
						{ label: text.UIAgentSelectPartyRecs, value: "PartyRecs" }
					])
			);
			return Row;
		}
	}
}