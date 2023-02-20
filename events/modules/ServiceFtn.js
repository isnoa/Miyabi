const client = require("../../miyabi");
const db = require("../../database/user");
const { EmbedBuilder } = require("discord.js");

client.on("interactionCreate", async (interaction) => {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId == "lang-select") {
            interaction.values.forEach(async (value) => {
                switch (value) {
                    case "lang_global":
                        db.findOne({ user: interaction.user.id }, async (err, data) => {
                            if (!data) {
                                new db({ user: interaction.user.id, i18n: "en-us", since: Date.now(), profileconnect: true })
                                    .save().catch(err => console.error(err))
                                await interaction.reply({
                                    content: `Language has been changed to 'English'.`,
                                    ephemeral: true,
                                    components: []
                                })
                            } else {
                                db.updateOne({ user: interaction.user.id }, { $set: { i18n: "en-us" } })
                                    .catch(err => console.error(err))
                                await interaction.update({
                                    embeds: [new EmbedBuilder().setDescription(`Language has been changed to 'English'.`)],
                                    ephemeral: true,
                                    components: []
                                })
                            }
                        })
                        break;

                    case "lang_kr":
                        db.findOne({ user: interaction.user.id }, async (err, data) => {
                            if (!data) {
                                new db({ user: interaction.user.id, i18n: "ko-kr", since: Date.now(), profileconnect: true })
                                    .save().catch(err => console.error(err))
                                await interaction.reply({
                                    content: `「언어」가 "한국어"로 변경 변경됬어.`,
                                    ephemeral: true,
                                    components: []
                                })
                            } else {
                                db.updateOne({ user: interaction.user.id }, { $set: { i18n: "ko-kr" } })
                                    .catch(err => console.error(err))
                                await interaction.update({
                                    embeds: [new EmbedBuilder().setDescription(`「언어」가 "한국어"로 변경됬어.`)],
                                    ephemeral: true,
                                    components: []
                                })
                            }
                        })
                        break;

                    case "lang_jp":
                        db.findOne({ user: interaction.user.id }, async (err, data) => {
                            if (!data) {
                                new db({ user: interaction.user.id, i18n: "ja-jp", since: Date.now(), profileconnect: true })
                                    .save().catch(err => console.error(err))
                                await interaction.reply({
                                    content: `「言語」が「日本語」に変更したの。`,
                                    ephemeral: true,
                                    components: []
                                })
                            } else {
                                db.updateOne({ user: interaction.user.id }, { $set: { i18n: "ja-jp" } })
                                    .catch(err => console.error(err))
                                await interaction.update({
                                    embeds: [new EmbedBuilder().setDescription(`「言語」が「日本語」に変更したの。`)],
                                    ephemeral: true,
                                    components: []
                                })
                            }
                        })
                        break;
                }
            })
        }
    }
})