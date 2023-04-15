const {
	CommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder
} = require("discord.js");
const db = require("../../database/user.js");
const logger = require("../../events/core/logger.js");
const { MiyabiColor } = require("../../database/color.js");
const text = require("../../database/ko-kr.js");

module.exports = {
	name: "설정",
	description: "너에 관한 정보를 수정할 수 있어",
	cooldown: 5000,
	options: [
		{
			name: "공개프로필",
			description: "너의 프로필을 공개 여부를 설정 할 수 있어",
			type: ApplicationCommandOptionType.String,
			choices: [
				{
					name: "공개 할래",
					value: "visible"
				},
				{
					name: "숨길래",
					value: "hidden"
				}
			],
			required: false
		},
		{
			name: "비공개프로필",
			description: "서버의 관리자만 너의 프로필 설정에 관계 없이 모든 프로필 정보를 볼 수 있게 할지 말지 설정할 수 있어",
			type: ApplicationCommandOptionType.String,
			choices: [
				{
					name: "공개 할래",
					value: "visible"
				},
				{
					name: "숨길래",
					value: "hidden"
				}
			],
			required: false
		},
		{
			name: "uid",
			description: "너의 프로필에 UID를 공개 여부를 설정 할 수 있어",
			type: ApplicationCommandOptionType.String,
			choices: [
				{
					name: "공개 할래",
					value: "visible"
				},
				{
					name: "숨길래",
					value: "hidden"
				}
			],
			required: false
		},
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		try {
			let profile = interaction.options.getString("프로필공개");
			let profileToAdmin = interaction.options.getString("관리자프로필공개");
			let uid = interaction.options.getString("UID공개");
			
			
		} catch (err) {
			interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
		}
	}
}