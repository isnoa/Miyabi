const client = require("../../miyabi");
const { InteractionType } = require('discord.js');
const db = require("../../database/user");

client.on("interactionCreate", async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        if (interaction.commandName === 'character') {
            const focusedValue = interaction.options.getFocused();
            db.findOne({ user: interaction.user.id }, async (err, userData) => {
                if (err) throw err;
                if (userData) {
                    const lang = require(`../../i18n/${userData.i18n}.js`)
                    const choices = [
                        lang.anby_demara || "Anby Demara",
                        lang.nicole_demara || "Nicole Demara",
                        lang.billy_kid || "Billy Kid",
                        lang.nekomiya_mana || "Nekomiya Mana",
                        lang.soldier_11 || "Soldier 11",
                        lang.corin_wickes || "Corin Wickes",
                        lang.von_lycaon || "Von Lycaon",
                        lang.anton_ivanov || "Anton Ivanov",
                        lang.koleda_belobog || "Koleda Belobog",
                        lang.ben_bigger || "Ben Bigger",
                        lang.soukaku || "Soukaku",
                        lang.hoshimi_miyabi || "Hoshimi Miyabi"
                    ]
                    const filtered = choices.filter(choice => choice.startsWith(focusedValue));
                    interaction.respond(
                        filtered.map(choice => ({ name: choice, value: choice })),
                    );
                }
            })
        }
    }
})