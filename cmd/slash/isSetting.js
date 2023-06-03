'use strict';
const {
	CommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder
} = require("discord.js");
const db = require("../../events/core/user.js");
const text = require("../../events/modules/ko-kr.js");

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
			let publicProfileVal = interaction.options.getString("공개프로필");
			let privateProfileVal = interaction.options.getString("비공개프로필");
			let uidShowVal = interaction.options.getString("uid");

			const user = await db.findOne({ userId: interaction.user.id });
			if (!user) {
				interaction.reply({ embeds: [new EmbedBuilder().setDescription(userMention(target.id) + "의 " + text.UIMismatchData).setColor(text.UIColourMiyabi)] })
			}

			// publicProfileVal
			if (publicProfileVal) {
				db.updateOne({ userId: interaction.user.id }, { $set: { publicProfile: publicProfileVal } })
					.catch(err => console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
			} else {
				new db({ userId: interaction.user.id, publicProfile: publicProfileVal })
					.save().catch(err => console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
			}

			// privateProfileVal
			if (privateProfileVal) {
				db.updateOne({ userId: interaction.user.id }, { $set: { privateProfile: privateProfileVal } })
					.catch(err => console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
			} else {
				new db({ userId: interaction.user.id, privateProfile: privateProfileVal })
					.save().catch(err => console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
			}

			// uidShowVal
			if (uidShowVal) {
				db.updateOne({ userId: interaction.user.id }, { $set: { showUID: uidShowVal } })
					.catch(err => console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
			} else {
				new db({ userId: interaction.user.id, showUID: uidShowVal })
					.save().catch(err => console.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
			}
			setTimeout(async() => {
				await interaction.reply({ content: "농ㅋㅋ" })
			}, 3000);
		} catch (err) {
			interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.UISrcIssue).setColor(text.UIColourMiyabi)], components: [] })
		}
	}
}