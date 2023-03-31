const {
	CommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder,
	StringSelectMenuBuilder,
	ActionRowBuilder
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
				.setTitle(data.data.name + " — " + text.UIAgentInfo)
				.setColor(data.data.colour)
				.setDescription(replaceDescription(data))
				.setFields(
					{
						name: "—기본 정보",
						value: `${text.UIAgentName}: ${data.data.name}\n${text.UIAgentGender}: ${data.data.gender}\n${text.UIAgentBirthDay}: ██월 ██일\n${text.UIAgentCamp}: ${data.data.camp}`,
						inline: true
					},
					{
						name: "—전투 정보",
						value: `${text.UIAgentDamageAttribute}: 얼음\n${text.UIAgentAttackAttribute}: 베기\n→ *에테리얼류(상성)*`,
						inline: true
					},
					{
						name: "—언어별 표기 & 성우",
						value: `미국: Hoshimi Miyabi\n일본: 星見雅 (성우: ${data.data.cv.japanese}) \n중국: 星见雅 (성우: ${data.data.cv.chinese})\n\u200B`,
						inline: false
					},
					{
						name: "—인터뷰 & 소개",
						value: `${data.data.interview}\n\n${data.data.intro}`,
						inline: false
					}
				)
				.setFooter({ text: text.UIPleaseKnowThat })
				.setThumbnail(data.data.archive.avatar)
			// const filter = i => i.values === 'Info'
			// const collector = interaction.channel.createMessageComponentCollector({ filter, time: 5000 });
			// collector.on('collect', async i => {
			// 	if (i.user.id === interaction.user.id) {
			// 		await i.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
			// 		setTimeout(async function setTimeAct() {
			// 			await i.editReply(`${i.user.id} clicked on the ${i.customId} button.`);
			// 			clearTimeout(setTimeAct)
			// 		}, 2000);
			// 		collector.stop();
			// 	} else {
			// 	    i.update({ content: "남의 것을 뺐으면 안 돼" });
			// 	    collector.stop();
			// 	}
			// 	//https://discordjs.guide/interactions/buttons.html#responding-to-buttons
			// })
			// collector.on('end', collected => console.log(`Collected ${collected.size} items`));
			interaction.reply({ embeds: [Embed], components: [selectAgentRow()] })
			addHistory(matchedAgent)
			logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Request Values: [${name}] || Interaction Latency: [${Math.abs(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
		})

		function replaceDescription(data) {
			if (matchedAgent === "soukaku") { return `>${(data.data.title).replace(/\n/i, " ")}` }
			else if (matchedAgent === "ben_bigger") { return `> ${(data.data.title).replace(/\n/i, " ")}` }
			else { return `> ${(data.data.title).replace(/\n/i, "\n> ")}` }
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

		function addHistory(matchedAgent) {
			db.findOne({ user: interaction.user.id }).then(async (userData) => {
				if (userData) {
					db.updateOne({ user: interaction.user.id }, { $set: { lastcharacter: matchedAgent } })
						.catch(err => logger.error(err));
				} else {
					new db({ timestamp: Date.now(), user: interaction.user.id, lastcharacter: matchedAgent })
						.save().catch(err => logger.error(err));
				}
			}).catch((err) => {
				if (err) throw err;
			})
		}
	}
}