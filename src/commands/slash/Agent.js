const {
	CommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder,
	StringSelectMenuBuilder,
	ActionRowBuilder,
	ComponentType
} = require("discord.js");
const axios = require("axios");
const text = require("../../events/utils/TextMap.json");

module.exports = {
	name: text.SC_IS_AGENT_NAME,
	description: text.SC_IS_AGENT_DESC,
	cooldown: 30000,
	options: [{
		name: text.SC_SUB_NAME,
		description: text.SC_SUB_NAME_DESC,
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
			let agentId = interaction.options.getString(text.SC_SUB_NAME);
			if (!agentId) return interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`이름을 찾을 수 없어.\`\`\`\n` + text.SRC_ISSUE).setColor(text.MIYABI_COLOR)] });

			const instance = axios.create({
				headers: {
					Authorization: `Token ${process.env.ghp}`
				}
			})

			await instance.get(`https://raw.githubusercontent.com/Shunsphere/zero-archive/main/database/agents/${agentId}.json`).then(async (response) => {
				let agentData = response.data.details

				const Embed = new EmbedBuilder()
					.setAuthor({ name: agentData.real_name + text.TWO_LINE + text.AGENT_INFO })
					.setColor(agentData.color)
					.setDescription((agentData.description.title).split("——")[0])
					.addFields(
						{
							name: text.AGENT_BASIC_INFO,
							value: `${text.AGENT_NAME}: ${agentData.real_name}\n${text.AGENT_GENDER}: ${agentData.gender}\n${text.AGENT_CAMP}: ${agentData.faction.text}`,
							inline: true
						},
						{
							name: text.AGENT_BATTLE_INFO,
							value: `${text.AGENT_ELEMENT}: ${agentData.element.text}\n${text.AGENT_DAMAGE}: ${agentData.attack.type.text}\n*→ ${agentData.attack.strong.text}(상성)*`,
							inline: true
						},
						{
							name: text.AGENT_VOICE_ACTOR,
							value: `\`\`\`🇯🇵 ${text.AGENT_VOICE_ACTOR_JAPANESE}: ${agentData.voice_actor.jp.localization}(${agentData.voice_actor.jp.mainland})\n🇨🇳 ${text.AGENT_VOICE_ACTOR_CHINESE}: ${agentData.voice_actor.cn.localization}(${agentData.voice_actor.cn.mainland})\`\`\``,
							// value: `:flag_jp: ${text.AGENT_VOICE_ACTOR_JAPANESE}: ${agentData.voice_actor.jp.localization}(${agentData.voice_actor.jp.mainland})\n:flag_cn: ${text.AGENT_VOICE_ACTOR_CHINESE}: ${agentData.voice_actor.cn.localization}(${agentData.voice_actor.cn.mainland})`,
							// value: `\`\`\`${text.AGENT_VOICE_ACTOR_JAPANESE}: ${agentData.voice_actor.jp.localization}(${agentData.voice_actor.jp.mainland})\n${text.AGENT_VOICE_ACTOR_CHINESE}: ${agentData.voice_actor.cn.localization}(${agentData.voice_actor.cn.mainland})\`\`\``,
							inline: false
						},
						// {
						// 	name: text.AGENT_IAI_INFO,
						// 	value: agentData.description.introduce,
						// 	inline: false
						// }
					)
					.setThumbnail("https://zenlessdata.web.app/upload/op-public/2023/02/05/9eefd58e0e58ae5b8f904af6c5b534f6_1424369388568759999.png");

				await interaction.reply({ embeds: [Embed], components: [selectAgentRow()] })
					.then(setTimeout(() => {
						interaction.editReply({ components: [] });
						collector.stop();
					}, 30000));
			});

			const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 30000 });

			collector.on('collect', async (i) => {
				if (!(i.user.id === interaction.user.id)) return i.reply({ content: text.STEAL_CONTROL, ephemeral: true })

				await instance.get(`https://raw.githubusercontent.com/Shunsphere/zero-archive/main/database/agents/${agentId}.json`).then(async (response) => {
					let agentData = response.data.details

					switch (i.values[0]) {
						case 'Info':
							const InfoEmbed = new EmbedBuilder()
								.setAuthor({ name: agentData.real_name + text.TWO_LINE + text.AGENT_INFO })
								.setColor(agentData.color)
								.setDescription((agentData.description.title).split("——")[0])
								.addFields(
									{
										name: text.AGENT_BASIC_INFO,
										value: `${text.AGENT_NAME}: ${agentData.real_name}\n${text.AGENT_GENDER}: ${agentData.gender}\n${text.AGENT_CAMP}: ${agentData.faction.text}`,
										inline: true
									},
									{
										name: text.AGENT_BATTLE_INFO,
										value: `${text.AGENT_ELEMENT}: ${agentData.element.text}\n${text.AGENT_DAMAGE}: ${agentData.attack.type.text}\n*→ ${agentData.attack.strong.text}(상성)*`,
										inline: true
									},
									{
										name: text.AGENT_VOICE_ACTOR,
										value: `\`\`\`🇯🇵 ${text.AGENT_VOICE_ACTOR_JAPANESE}: ${agentData.voice_actor.jp.localization}(${agentData.voice_actor.jp.mainland})\n🇨🇳 ${text.AGENT_VOICE_ACTOR_CHINESE}: ${agentData.voice_actor.cn.localization}(${agentData.voice_actor.cn.mainland})\`\`\``,
										// value: `:flag_jp: ${text.AGENT_VOICE_ACTOR_JAPANESE}: ${agentData.voice_actor.jp.localization}(${agentData.voice_actor.jp.mainland})\n:flag_cn: ${text.AGENT_VOICE_ACTOR_CHINESE}: ${agentData.voice_actor.cn.localization}(${agentData.voice_actor.cn.mainland})`,
										// value: `\`\`\`${text.AGENT_VOICE_ACTOR_JAPANESE}: ${agentData.voice_actor.jp.localization}(${agentData.voice_actor.jp.mainland})\n${text.AGENT_VOICE_ACTOR_CHINESE}: ${agentData.voice_actor.cn.localization}(${agentData.voice_actor.cn.mainland})\`\`\``,
										inline: false
									},
									// {
									// 	name: text.AGENT_IAI_INFO,
									// 	value: agentData.description.introduce,
									// 	inline: false
									// }
								)
								.setThumbnail("https://zenlessdata.web.app/upload/op-public/2023/02/05/9eefd58e0e58ae5b8f904af6c5b534f6_1424369388568759999.png");

							await i.update({ embeds: [InfoEmbed], components: [selectAgentRow()] })
							break;
						case 'Stats':
							const StatsEmbed = new EmbedBuilder()
								.setAuthor({ name: agentData.name })
								.setTitle(text.AGENT_STATS)
								.setColor(agentData.color)
								.addFields(
									{
										name: text.AGENT_EX_INDICATOR,
										value: text.AGENT_MAX_LEVEL_CRITERIA,
										inline: false
									},
									{
										name: text.AGENT_NECESSARY_ITEM,
										value: `${text.MIDDLE_DOT}${text.AGENT_MATERIALS}·${agentData.name}: ?\n${text.MIDDLE_DOT}${text.AGENT_ARCHIVE}: ?`,
										inline: false
									},
									{
										name: text.AGENT_COMPARE,
										value: `${text.HP}: 462 → 5164\n${text.ATK}: 101 → 1132\n${text.DEF}: 48 → 567\n${text.FIGHT_PROP_IMPACT}: 110 → 121\n${text.CRITICAL_RATE}: 5% → 10%\n${text.CRITICAL_DMG}: 50% → 50%\n${text.PENETRATION_RATIO}: 0% → 0%\n${text.PENETRATION}: 0 → 3%\n${text.ENERGY_RECOVERY}: 1.8 → 1.86`,
										inline: false
									}
								)
								.setThumbnail(agentData.archive.avatar)
							await i.update({ embeds: [StatsEmbed], components: [selectAgentRow()] })
							break;
						case 'BasicAttack':
							const Embed = new EmbedBuilder()
								.setAuthor({ name: agentData.name })
								.setTitle(text.AGENT_BASIC_ATK)
								.setColor(agentData.color)
								.setDescription("해당 캐릭터의 추천 순위는 1st, 2nd, 3rd 순이랍니다.")
								.addFields(
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
								.setThumbnail(agentData.archive.avatar)
							await i.update({ embeds: [Embed], components: [selectAgentRow()] })
							break;
						case 'SpecialAttack':
							const SpecialAttackEmbed = new EmbedBuilder()
								.setAuthor({ name: agentData.name })
								.setTitle(text.AGENT_SPECIAL_ATK)
								.setColor(agentData.color)
								.setDescription("해당 캐릭터의 추천 순위는 1st, 2nd, 3rd 순이랍니다.")
								.addFields(
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
								.setThumbnail(agentData.archive.avatar)
							await i.update({ embeds: [SpecialAttackEmbed], components: [selectAgentRow()] })
							break;
						case 'ComboAttack':
							const ComboAttackEmbed = new EmbedBuilder()
								.setAuthor({ name: agentData.name })
								.setTitle(text.AGENT_COMBO_ATK)
								.setColor(agentData.color)
								.setDescription("해당 캐릭터의 추천 순위는 1st, 2nd, 3rd 순이랍니다.")
								.addFields(
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
								.setThumbnail(agentData.archive.avatar)
							await i.update({ embeds: [ComboAttackEmbed], components: [selectAgentRow()] })
							break;
						case 'Dodge':
							const DodgeEmbed = new EmbedBuilder()
								.setAuthor({ name: agentData.name })
								.setTitle(text.AGENT_DODGE)
								.setColor(agentData.color)
								.setDescription("해당 캐릭터의 추천 순위는 1st, 2nd, 3rd 순이랍니다.")
								.addFields(
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
								.setThumbnail(agentData.archive.avatar)
							await i.update({ embeds: [DodgeEmbed], components: [selectAgentRow()] })
							break;
						case 'Talent':
							const TalentEmbed = new EmbedBuilder()
								.setAuthor({ name: agentData.name })
								.setTitle(text.AGENT_TALENT)
								.setColor(agentData.color)
								.setDescription("해당 캐릭터의 추천 순위는 1st, 2nd, 3rd 순이랍니다.")
								.addFields(
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
								.setThumbnail(agentData.archive.avatar)
							interaction.update({ embeds: [TalentEmbed], components: [selectAgentRow()] })
							break;
						case 'PartyRecs':
							const PartyRecsEmbed = new EmbedBuilder()
								.setAuthor({ name: agentData.name })
								.setTitle(text.AGENT_RECOMMENDED_PARTY)
								.setColor(agentData.color)
								.setDescription(text.AGENT_TIER_ORDER)
								.addFields(
									{
										name: `${text.AGENT_TIER_1ST} — 호소빌`,
										value: "> 호시미 미야비\n> 소우카쿠\n> 빌리 키드",
										inline: true
									},
									{
										name: `${text.AGENT_TIER_2ND} — 호소코`,
										value: "> 호시미 미야비\n> 소우카쿠\n> 코린 위크스",
										inline: true
									},
									{
										name: `${text.AGENT_TIER_3RD} — 호소앤`,
										value: "> 호시미 미야비\n> 소우카쿠\n> 앤톤 이바노프",
										inline: true
									}
								)
								.setThumbnail(agentData.archive.avatar)
							interaction.update({ embeds: [PartyRecsEmbed], components: [selectAgentRow()] })
							break;
					}
				})
			})
		} catch (err) {
			interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.SRC_ISSUE).setColor(text.MIYABI_COLOR)], components: [] })
			throw err;
		}

		function replaceDescription(agentId, agentData) {
			switch (agentId) {
				case "soukaku":
					return `> ${(agentData.description.title).replace(/\n/i, " ").replace(/면/i, "면\n>")}`;
				case "ben_bigger":
					return `> ${(agentData.description.title).replace(/\n/i, " ").replace(/을/i, "을\n>")}`;
				default:
					return `> ${(agentData.description.title).replace(/\n/i, "\n> ")}`;
			}
		}

		function selectAgentRow() {
			const Row = new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId("selectAgent")
					.setPlaceholder(text.AGENT_OPTION)
					.setMaxValues(1)
					.addOptions([
						{ label: text.AGENT_INFO, value: "Info" },
						{ label: text.AGENT_STATS, value: "Stats" },
						{ label: text.AGENT_BASIC_ATK, value: "BasicAttack" },
						{ label: text.AGENT_SPECIAL_ATK, value: "SpecialAttack" },
						{ label: text.AGENT_COMBO_ATK, value: "ComboAttack" },
						{ label: text.AGENT_DODGE, value: "Dodge" },
						{ label: text.AGENT_TALENT, value: "Talent" },
						{ label: text.AGENT_RECOMMENDED_PARTY, value: "PartyRecs" }
					])
			);
			return Row;
		}
	}
}