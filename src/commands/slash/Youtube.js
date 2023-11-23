// const {
//     CommandInteraction,
//     ApplicationCommandOptionType,
//     ChannelType,
//     PermissionsBitField
// } = require("discord.js");
// const Video = require("../../models/youtube")
// const axios = require("axios");
// const text = require("../../events/utils/TextMap.json");

// module.exports = {
//     name: text.SC_IS_YOUTUBE_NAME,
//     description: text.SC_IS_YOUTUBE_DESC,
//     cooldown: 30000,
//     options: [
//         {
//             name: "채널",
//             description: "유튜브 영상이 올라오면 알림을 받을 채널을 선택해.",
//             type: ApplicationCommandOptionType.Channel,
//             channel_types: [ChannelType.GuildText],
//             required: true,
//         },
//         {
//             name: "유튜브",
//             description: "유튜브 영상이 올라오면 알림을 받을 유튜브 채널을 선택해.",
//             type: ApplicationCommandOptionType.String,
//             choices: [
//                 { name: '絕區零', value: "zzz_cht" },
//                 { name: '젠레스 존 제로', value: 'zzz_ko' },
//                 { name: 'ゼンレスゾーンゼロ', value: 'zzz_jp' },
//                 { name: 'Zenless Zone Zero', value: 'zzz_official' }

//             ],
//             required: true,
//         },
//         {
//             name: "역할",
//             description: "유튜브 영상이 올라오면 알림을 받을 역할을 선택해.",
//             type: ApplicationCommandOptionType.Role,
//             required: false,
//         }
//     ],
//     /**
//      *
//      * @param {Client} client
//      * @param {CommandInteraction} interaction
//      */
//     run: async (client, interaction) => {
//         if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels || PermissionsBitField.Flags.Administrator))
//             return interaction.reply({ content: "이 기능을 쓸려면 역할에서 `채널 관리하기` 또는 `관리자`를 필요로 해.", ephemeral: true })

//         //새로운 업무 브리핑이 업로드됐네요. 네? 영상이요? 업무 브리핑 아니었나요?

//         const channel = interaction.options.getChannel('채널');
//         const youtube = interaction.options.getString('유튜브');
//         const role = interaction.options.getRole('역할');


//     }
// }