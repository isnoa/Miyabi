const {
    CommandInteraction,
    EmbedBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder
} = require("discord.js");
const db = require("../../database/user");

module.exports = {
    name: "language",
    name_localizations: {
        "ko": "언어",
        "ja": "言語"
    },
    description: "You can set the language",
    description_localizations: {
        "ko": "언어를 설정할 수 있어",
        "ja": "言語を設定できる"
    },
    timeout: 5000,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        db.findOne({ user: interaction.user.id }, async (err, userData) => {
            if (err) throw err;
            if (userData) {
                const lang = require(`../../i18n/${userData.i18n}.js`)
                const embedTure = new EmbedBuilder()
                    .setTitle(lang.Language_selection_Text)
                    .setFields(
                        {
                            name: "🇺🇸 / Global (English)",
                            value: "All functions can be changed to that language."
                        },
                        {
                            name: "🇰🇷 / 한국 (한국어)",
                            value: "모든 기능이 해당 언어로 변경이 가능해."
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
                                description: "All functions can be changed to that language.",
                                emoji: "🇺🇸",
                            },
                            {
                                label: "한국 (한국어)",
                                value: "lang_kr",
                                description: "모든 기능이 해당 언어로 변경이 가능해.",
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
                            value: "All functions can be changed to that language."
                        },
                        {
                            name: "🇰🇷 / 한국 (한국어)",
                            value: "모든 기능이 해당 언어로 변경이 가능해."
                        },
                        // {
                        //     name: "🇯🇵 / 日本 (日本語)",
                        //     value: "すべての機能およびサービスが該当言語に変更されます"
                        // }
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
                                description: "All functions can be changed to that language.",
                                emoji: "🇺🇸",
                            },
                            {
                                label: "한국 (한국어)",
                                value: "lang_kr",
                                description: "모든 기능이 해당 언어로 변경이 가능해.",
                                emoji: "🇰🇷",
                            },
                            // {
                            //     label: "日本, (日本語)",
                            //     value: "lang_jp",
                            //     description: "すべての機能およびサービスが該当言語に変更されます",
                            //     emoji: "🇯🇵",
                            // }
                        ])
                );
                interaction.reply({ embeds: [embedFalse], components: [row], ephemeral: true })
            }
        })
    }
}