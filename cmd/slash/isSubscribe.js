const {
    CommandInteraction,
    ApplicationCommandOptionType,
    ChannelType,
    PermissionsBitField
} = require("discord.js");
const axios = require("axios");
const text = require("../../events/utils/ko-kr.js");

module.exports = {
    name: "유튜브",
    description: "「젠레스 존 제로」의 유튜브 채널의 알림을 받을 수 있어.",
    cooldown: 30000,
    options: [
        {
            name: "채널",
            description: "유튜브 영상이 올라오면 알림을 받을 채널을 선택해.",
            type: ApplicationCommandOptionType.Channel,
            channel_types: [ChannelType.GuildText],
            required: true,
        },
        {
            name: "유튜브",
            description: "유튜브 영상이 올라오면 알림을 받을 유튜브 채널을 선택해.",
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: '絕區零', value: "zzz_cht" },
                { name: '젠레스 존 제로', value: 'zzz_ko' },
                { name: 'ゼンレスゾーンゼロ', value: 'zzz_jp' },
                { name: ' Zenless Zone Zero', value: 'zzz_official' }

            ],
            required: true,
        },
        {
            name: "문구",
            description: "유튜브 영상이 올라오면 알림의 문구를 선택해.",
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: text.UIYTNotifie0, value: 'UIYTNotifie0' },
                { name: text.UIYTNotifie1, value: "UIYTNotifie1" },
                { name: text.UIYTNotifie2, value: 'UIYTNotifie2' },
                { name: text.UIYTNotifie3, value: 'UIYTNotifie3' }
            ],
            required: true,
        },
        {
            name: "역할",
            description: "유튜브 영상이 올라오면 알림을 받을 역할을 선택해.",
            type: ApplicationCommandOptionType.Role,
            required: false,
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels || PermissionsBitField.Flags.Administrator))
            return interaction.reply({ content: "이 기능을 쓸려면 `채널 관리하기` 또는 `관리자`를 필요로 해.", ephemeral: true })

        const channel = interaction.options.getChannel('채널');
        const youtube = interaction.options.getString('유튜브');
        const phrase = interaction.options.getString('문구');
        const role = interaction.options.getRole('역할');

        if (role) {
            interaction.reply({ content: `${channel.id}, ${youtube}, ${phrase}, ${role.id}` })
        } else {
            interaction.reply({ content: `${channel.id}, ${youtube}, ${phrase}` })
        }
    },
};