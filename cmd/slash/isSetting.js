const {
	CommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder
} = require("discord.js");
const db = require("../../events/models/user");
const text = require("../../events/utils/ko-kr");

module.exports = {
	name: text.SC_IS_SETTING_NAME,
	description: "너에 관한 정보를 수정할 수 있어.",
	cooldown: 5000,
	options: [
		{
			name: "프로필",
			description: "너의 프로필을 다양하게 설정 할 수 있어",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "표시",
					description: "너의 프로필에서 변경 할 표시를 선택해",
					type: ApplicationCommandOptionType.String,
					choices: [
						{
							name: "프로필 표시 여부",
							value: "showProfile"
						},
						{
							name: "UID 프로필에 표시 여부",
							value: "showUID"
						}
					],
					required: true
				},
				{
					name: "선택",
					description: "너의 프로필에서 변경 할 걸 선택해",
					type: ApplicationCommandOptionType.String,
					choices: [
						{
							name: "표시",
							value: "on"
						},
						{
							name: "숨김",
							value: "off"
						}
					],
					required: true
				}
			]
		},
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		try {
			let display = interaction.options.getString("표시");
			let selection = interaction.options.getString("선택");

			const user = await db.findOne({ userId: interaction.user.id });
			if (!user) {
				return interaction.reply({ embeds: [new EmbedBuilder().setDescription(userMention(target.id) + "의 " + text.UIMisMatchData).setColor(text.ColourOfMiyabi)] });
			}

			let booleanSelection = selection === "off" ? false : true;

			if (display === "publicProfile") {
				db.updateOne({ userId: interaction.user.id }, { $set: { publicProfile: booleanSelection } })
					.catch(err => console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
			} else if (display === "privateProfile") {
				db.updateOne({ userId: interaction.user.id }, { $set: { privateProfile: booleanSelection } })
					.catch(err => console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
			} else if (display === "showUID") {
				db.updateOne({ userId: interaction.user.id }, { $set: { showUID: booleanSelection } })
					.catch(err => console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
			}

			interaction.reply()
		} catch (err) {
			interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.UISrcIssue).setColor(text.ColourOfMiyabi)], components: [] });
		}
	}
}