const {
	CommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder
} = require("discord.js");
const axios = require("axios");
const text = require("../../events/utils/ko-kr");

module.exports = {
	name: text.SC_IS_FOOD_NAME,
	description: '음식 종류를 알려줄게.',
	cooldown: 5000,
	options: [{
		name: '이름',
		description: '알아볼 음식의 이름을 입력해.',
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
			// let foodName = interaction.options.getString('이름');
			await axios.get('https://zenlessdata.web.app/upload/community/data/noodle/fried_bbq_noodles/ramen.json').then(async (foodData) => {
				const Embed = new EmbedBuilder()
					.setAuthor({ iconURL: "https://cdn.discordapp.com/emojis/1082596238404354058.webp?size=48&quality=lossless", name: foodData.data.ZZZRamen.name })
					.setDescription('> ' + foodData.data.ZZZRamen.desc)
					.setColor('#C02E1B')
					.setFields(
						{
							name: `음식 효과`,
							value: foodData.data.ZZZRamen.effect.desc + '\n' + foodData.data.ZZZRamen.info.tips,
							inline: false
						},
						{
							name: "판매 지점",
							value: "YET",
							inline: true
						},
						{
							name: "가격",
							value: '<:Coin:1028294870009389096> ' + foodData.data.ZZZRamen.info.price,
							inline: true
						}
					)
					.setThumbnail(foodData.data.ZZZRamen.info.foods_image)
				await interaction.reply({ embeds: [Embed] })
				console.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
			})
		} catch (err) {
			interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.UISrcIssue).setColor(text.ColourOfMiyabi)], components: [] })
		}
	}
}