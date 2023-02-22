// const { CommandInteraction, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
// const db = require("../../database/guild");

// module.exports = {
//     name: "notice",
//     name_localizations: {
//         "ko": "공지",
//         "ja": "お知らせ"
//     },
//     description: "You can choose which channels you want to receive notices related to 「Miyabi」",
//     description_localizations: {
//         "ko": "「Miyabi」와 관련된 공지를 받을 채널을 선택할 수 있습니다",
//         "ja": "「Miyabi」に関するお知らせを受けるチャンネルを選択することができます"
//     },
//     timeout: 5000,
//     options: [
//         {
//             name: "channel",
//             name_localizations: {
//                 "ko": "채널",
//                 "ja": "チャンネル"
//             },
//             description: "Please enter a channel",
//             description_localizations: {
//                 "ko": "채널을 입력해 주세요",
//                 "ja": "チャンネルを入力してください"
//             },
//             type: ApplicationCommandOptionType.Channel,
//             channelTypes: [0],
//             required: true
//         },
//         // {
//         //     name: "",
//         //     name_localizations: {
//         //         "ko": "",
//         //         "ja": ""
//         //     },
//         //     description: "Please enter a ",
//         //     description_localizations: {
//         //         "ko": "",
//         //         "ja": ""
//         //     },
//         //     type: ApplicationCommandOptionType.String,
//         //     choices: [
//         //         {
//         //             name: "",
//         //             value: ""
//         //         },
//         //         {
//         //             name: "",
//         //             value: ""
//         //         }
//         //     ],
//         //     required: true
//         // }
//     ],
//     /**
//      *
//      * @param {Client} client
//      * @param {CommandInteraction} interaction
//      * @param {String[]} args
//      */
//     run: async (client, interaction, args) => {
//         db.findOne({ channel: interaction.channel.id }, async (err, data) => {
//             if (err) throw err;
//             if (data) {
//                 const Embed = new EmbedBuilder()
//                     .setTitle(lang.d)
//                     .setDescription(lang.d)
//                     .setFooter({ text: lang.d })
//             } else {
//                 const Embed = new EmbedBuilder()
//                     .setTitle("NOTCIES")
//                     .setDescription(`The information of the existing channel has been overwritten. From now on, a notice will be sent to <#${channel.id}>.`)
//                     .setFooter({ text: "Even if you choose the wrong language, you can choose again." })
//             }
//             interaction.reply({ embeds: [Embed], ephemeral: true })
//         })
//     }
// }