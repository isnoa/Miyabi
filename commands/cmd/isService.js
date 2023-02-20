const {
    CommandInteraction,
    EmbedBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder
} = require("discord.js");
const db = require("../../database/user");

module.exports = {
    name: "register",
    name_localizations: {
        "ko": "가입",
        "ja": "加入"
    },
    description: "Register to use commands related to 「Zenless Zone Zero」",
    description_localizations: {
        "ko": "「Zenless Zone Zero」와 관련된 명령어들을 사용할수 있도록 가입을 진행.",
        "ja": "「Zenless Zone Zero」に関連するコマンドを使用できるよう加入を進行。"
    },
    timeout: 5000,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        db.findOne({ user: interaction.user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                const lang = require(`../../i18n/${data.i18n}.js`)
                const embedTure = new EmbedBuilder()
                    .setTitle(lang.Language_selection_Text)
                    .setFields(
                        {
                            name: "🇺🇸 / Global (English)",
                            value: "All features and services will be changed to their language."
                        },
                        {
                            name: "🇰🇷 / 한국 (한국어)",
                            value: "모든 기능 및 서비스가 해당 언어로 변경됩니다."
                        },
                        // {
                        //     name: "🇯🇵 / 日本, (日本語)",
                        //     value: "すべての機能およびサービスが該当言語に変更されます"
                        // }
                    )
                    .setFooter({ text: lang.Language_selection_Relax })
                const row = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId("lang-select")
                        .setPlaceholder(lang.Language_selection_Text)
                        .setMaxValues(1)
                        .addOptions([
                            {
                                label: "Global (English)",
                                value: "lang_global",
                                description: "All features and services will be changed to their language.",
                                emoji: "🇺🇸",
                            },
                            {
                                label: "한국 (한국어)",
                                value: "lang_kr",
                                description: "모든 기능 및 서비스가 해당 언어로 변경됩니다.",
                                emoji: "🇰🇷",
                            },
                            // {
                            //     label: "日本 (日本語)",
                            //     value: "lang_jp",
                            //     description: "すべての機能およびサービスが該当言語に変更されます",
                            //     emoji: "🇯🇵",
                            // }
                        ])
                );
                interaction.reply({ embeds: [embedTure], components: [row], ephemeral: true })
            } else {
                const embedFalse = new EmbedBuilder()
                    .setTitle("Language Selection")
                    .setFields(
                        {
                            name: "🇺🇸 / Global (English)",
                            value: "All features and services will be changed to their language."
                        },
                        {
                            name: "🇰🇷 / 한국 (한국어)",
                            value: "모든 기능 및 서비스가 해당 언어로 변경됩니다."
                        },
                        {
                            name: "🇯🇵 / 日本 (日本語)",
                            value: "すべての機能およびサービスが該当言語に変更されます"
                        }
                    )
                    .setFooter({ text: "Even if you choose the wrong language, you can choose again." })
                const row = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId("lang-select")
                        .setPlaceholder(`Select a language.`)
                        .setMaxValues(1)
                        .addOptions([
                            {
                                label: "Global (English)",
                                value: "lang_global",
                                description: "All features and services will be changed to their language.",
                                emoji: "🇺🇸",
                            },
                            {
                                label: "한국 (한국어)",
                                value: "lang_kr",
                                description: "모든 기능 및 서비스가 해당 언어로 변경됩니다.",
                                emoji: "🇰🇷",
                            },
                            {
                                label: "日本, (日本語)",
                                value: "lang_jp",
                                description: "すべての機能およびサービスが該当言語に変更されます",
                                emoji: "🇯🇵",
                            }
                        ])
                );
                interaction.reply({ embeds: [embedFalse], components: [row], ephemeral: true })
            }
        })
    }
}