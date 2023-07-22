// const {
//     CommandInteraction,
//     ApplicationCommandOptionType,
//     ChannelType,
//     PermissionsBitField
// } = require("discord.js");
// const Video = require("../../events/models/youtube")
// const axios = require("axios");
// const text = require("../../events/utils/ko-kr");

// module.exports = {
//     name: text.SC_IS_YOUTUBE_NAME,
//     description: "「젠레스 존 제로」의 유튜브 채널의 알림을 받을 수 있어.",
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
//             name: "문구",
//             description: "유튜브 영상이 올라오면 알림의 문구를 선택해.",
//             type: ApplicationCommandOptionType.String,
//             choices: [
//                 { name: text.UIYTNotifie0, value: 'UIYTNotifie0' },
//                 { name: text.UIYTNotifie1, value: "UIYTNotifie1" },
//                 { name: text.UIYTNotifie2, value: 'UIYTNotifie2' },
//                 { name: text.UIYTNotifie3, value: 'UIYTNotifie3' }
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
//             return interaction.reply({ content: "이 기능을 쓸려면 `채널 관리하기` 또는 `관리자`를 필요로 해.", ephemeral: true })

//         const channel = interaction.options.getChannel('채널');
//         const youtube = interaction.options.getString('유튜브');
//         const phrase = interaction.options.getString('문구');
//         const role = interaction.options.getRole('역할');

//         // const Video = sequelize.define('youtube', {
//         //     videoId: {
//         //         type: DataTypes.STRING,
//         //         allowNull: false,
//         //         unique: true,
//         //     },
//         //     channelId: {
//         //         type: DataTypes.STRING,
//         //         allowNull: false,
//         //     },
//         //     youtubeId: {
//         //         type: DataTypes.STRING,
//         //         allowNull: false,
//         //     },
//         //     phrase: {
//         //         type: DataTypes.STRING,
//         //         allowNull: false,
//         //     },
//         //     roleId: {
//         //         type: DataTypes.STRING,
//         //         allowNull: false,
//         //     },
//         // });

//         startWatchingVideos();

//         if (role) {
//             interaction.reply({ content: `${channel.id}, ${youtube}, ${phrase}, ${role.id}` })
//         } else {
//             interaction.reply({ content: `${channel.id}, ${youtube}, ${phrase}` })
//         }

//         // YouTube API로 Pub/Sub 웹훅 생성
//         async function createWebhook() {
//             const response = await axios.post(
//                 'https://www.googleapis.com/youtube/v3/subscriptions',
//                 {
//                     snippet: {
//                         resourceId: {
//                             kind: 'youtube#channel',
//                             channelId: 'UCMDG3f8kmRtuTCu8kSIh6OQ', // 여기에 자신의 YouTube 채널 ID를 입력하세요
//                         },
//                     },
//                     callbackUrl: 'YOUR_CALLBACK_URL', // 여기에 콜백 URL을 입력하세요
//                     topicDetails: {
//                         topicId: 'zzzero', // 여기에 토픽 ID를 입력하세요
//                         resourceType: 'video',
//                     },
//                 }
//             );

//             const webhookUrl = response.data.pushNotification.url;
//             console.log(`Webhook URL: ${webhookUrl}`);
//         }

//         // MySQL에서 가장 최근 동영상 가져오기
//         async function getLatestVideoFromDb() {
//             const latestVideo = await Video.findOne({
//                 order: [['id', 'DESC']],
//             });
//             return latestVideo;
//         }

//         // 누락된 동영상을 Discord 채널로 전송
//         async function sendMissingVideosToDiscord(missingVideos, channel) {
//             for (const video of missingVideos) {
//                 await channel.send(`Missing Video: https://youtube.com/watch?v=${video.videoId}`);
//             }
//         }

//         // YouTube 영상 체크
//         async function checkYouTubeVideos() {
//             const latestVideoFromDb = await getLatestVideoFromDb();

//             // YouTube API로 영상 가져오기
//             const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
//                 params: {
//                     channelId: 'UCMDG3f8kmRtuTCu8kSIh6OQ',
//                     maxResults: 5,
//                     order: 'date',
//                     part: 'snippet',
//                     key: process.env.YOUTUBE_API_KEY,
//                 },
//             });

//             const videos = response.data.items;

//             // 누락된 영상 확인
//             const missingVideos = [];
//             let isVideoMissing = false;

//             for (const video of videos) {
//                 if (video.id.videoId === latestVideoFromDb?.videoId) {
//                     break;
//                 }

//                 missingVideos.push({
//                     videoId: video.id.videoId,
//                     title: video.snippet.title,
//                 });

//                 isVideoMissing = true;
//             }

//             // 누락된 영상 전송
//             if (isVideoMissing) {
//                 const channel = client.channels.cache.get('1025677003585761320');
//                 await sendMissingVideosToDiscord(missingVideos.reverse(), channel);

//                 // MySQL에 누락된 영상 저장
//                 for (const video of missingVideos) {
//                     await Video.create({
//                         videoId: video.videoId,
//                         title: video.title,
//                     });
//                 }
//             }
//         }

//         // 영상 감시 시작
//         function startWatchingVideos() {
//             setInterval(checkYouTubeVideos, 60000); // 1분마다 체크
//         }
//     }
// }