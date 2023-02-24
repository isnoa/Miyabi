const { CommandInteraction, EmbedBuilder } = require("discord.js");
const db = require("../../database/user");

module.exports = {
    name: "info",
    name_localizations: {
        "ko": "정보",
        "ja": "情報"
    },
    description: "I'll give you some information about 「Miyabi」",
    description_localizations: {
        "ko": "「Miyabi」에 관련한 정보를 알려 줄게",
        "ja": "「Miyabi」に関する情報を教えてあげる"
    },
    timeout: 5000,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        // db.findOne({ user: interaction.user.id }, async (err, userData) => {
        //     if (err) throw err;
        //     if (userData) {
        //         const lang = require(`../../i18n/${userData.}.js`);
        //         const time = "<t:1680706800:R>"
        //         const Embed = new EmbedBuilder()
        //             .setTitle("미야비에 대해")
        //             .setDescription(`**미야비는 「Zenless Zone Zero」에 나오는 캐릭터 중에 하나입니다.\n또한, 저희가 진심으로 애정 하는 캐릭터이기도 합니다.\n미야비는 정식 출시 이후 ${time}이라는 시간을 저희와 함께하고 있으며, 해당 서비스를 사용해 주시는 분들의 성원, 보다 나은 서비스의 퀄리티로 보답해 드리도록 더욱 노력하겠습니다.**\n——개발자 노아/윤, 친애하는 사용자분들에게\n⠀`)
        //             .setFields(
        //                 {
        //                     name: "— 일러스트 출처 (트위터)",
        //                     value: "[@YonesDraws](https://twitter.com/yonesdraws), [@hopedienhy](https://mobile.twitter.com/hopedienhy)"
        //                 },
        //                 {
        //                     name: "— 이용 및 통계",
        //                     value: `미야비는 ${client.guilds.cache.size}개의 서버에서 활동 중입니다. 그리고, ${client.users.cache.size}명의 사용자분들께서 미야비를 사용해 주셨습니다`
        //                 },
        //                 {
        //                     name: "— 명령어",
        //                     value: "[자세히 알아보기](https://www.dafk.net/what/)"
        //                 },
        //                 {
        //                     name: "⠀",
        //                     value: "**— 개발자** (화공 사진이라 픽셀이 보이면 개추)"
        //                 }
        //             )
        //             .setImage("https://cdn.discordapp.com/attachments/1019924590723612733/1029043683120648192/unknow123n1.png")
        //         interaction.reply({ embeds: [Embed], ephemeral: true })
        interaction.reply("아직이야.. 후훗.")
            }
//         })
//     }
}