const {
	CommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder
} = require("discord.js");
const axios = require("axios");

module.exports = {
	name: '음식',
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
	 * @param {String[]} args
	 */
	run: async (client, interaction) => {
		try {
			const name = interaction.options.getString('이름');
			const response = await axios.get('https://zenlessdata.web.app/upload/community/data/noodle/fried_bbq_noodles/ramen.json')
			const Embed = new EmbedBuilder()
				.setAuthor({ iconURL: "https://cdn.discordapp.com/emojis/1082596238404354058.webp?size=48&quality=lossless", name: response.data.ZZZRamen.name })
				.setDescription('> ' + response.data.ZZZRamen.desc)
				.setColor('#C02E1B')
				.setFields(
					{
						name: `음식 효과`,
						value: response.data.ZZZRamen.effect.desc + '\n' + response.data.ZZZRamen.info.tips,
						inline: false
					},
					{
						name: "판매 지점",
						value: "YET",
						inline: true
					},
					{
						name: "가격",
						value: '<:Coin:1028294870009389096> ' + response.data.ZZZRamen.info.price,
						inline: true
					}
				)
				.setThumbnail(response.data.ZZZRamen.info.foods_image)
			interaction.reply({ embeds: [Embed] })
			logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Request Values: [${name}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
		} catch (err) { interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] }) }
	}
}