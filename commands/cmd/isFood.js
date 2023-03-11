const {
	CommandInteraction,
	ApplicationCommandOptionType,
	EmbedBuilder
} = require("discord.js");
const axios = require("axios");

module.exports = {
	name: '음식',
	description: '음식 종류를 알려줄게.',
	timeout: 5000,
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
	run: async (client, interaction, args) => {
		const name = interaction.options.getString('이름');
		if (name == "검은 면기: 훈제 차슈라면") {
			const URL = "https://zenlessdata.web.app/upload/community/data/noodle/smoke_bbq_noodles/ramen.json"
			generateObject(URL)
		} else if (name == "흰 면기: 호박라면") {
			const URL = "https://zenlessdata.web.app/upload/community/data/noodle/pumpkin_soup_noodles/ramen.json"
			generateObject(URL)
		} else if (name == "흰 면기: 차슈 튀김라면") {
			const URL = "https://zenlessdata.web.app/upload/community/data/noodle/fried_bbq_noodles/ramen.json"
			generateObject(URL)
		} else if (name == "흰 면기: 홍고추  돈코츠라면") {
			const URL = "https://zenlessdata.web.app/upload/community/data/noodle/red_pepper_meat_noodles/ramen.json"
			generateObject(URL)
		} else if (name == "흰 면기: 청고추 돈코츠라면") {
			const URL = "https://zenlessdata.web.app/upload/community/data/noodle/green_pepper_meat_noodles/ramen.json"
			generateObject(URL)
		} else if (name == "흰 면기: 해물라면") {
			const URL = "https://zenlessdata.web.app/upload/community/data/noodle/seafood_noodles/ramen.json"
			generateObject(URL)
		} 

		function generateObject(URL) {
			try {
				axios.get(URL).then(data => {

					const food_name = data.data.ZZZRamen.name
					const food_desc = data.data.ZZZRamen.desc
					const food_tips = data.data.ZZZRamen.info.tips
					const food_price = data.data.ZZZRamen.info.price
					const food_img = data.data.ZZZRamen.info.foods_image
					const food_effect = data.data.ZZZRamen.effect.desc
					const food_effect_icon = data.data.ZZZRamen.effect.icon

					const Embed = new EmbedBuilder()
						.setAuthor({ name: food_name })
						.setDescription(food_desc)
						.setColor('#C02E1B')
						.setFields(
							{
								name: `음식 효과`,
								value: food_effect+` `+food_effect_icon+`\n`+food_tips
							},
							{
								name: "가격",
								value: food_price+` <:Coin:1028294870009389096>`
							}
						)
						.setThumbnail(food_img)
					interaction.reply({ embeds: [Embed] })
					logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Request Values: [${name}] || Interaction Latency: [${Math.abs(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
				})
			} catch (err) {
				interaction.reply({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${name}라는 이름을 찾을 수 없어.\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
				logger.error(err)
			}
		}
	}
}