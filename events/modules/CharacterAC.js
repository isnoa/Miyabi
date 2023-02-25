const client = require("../../miyabi");
const { InteractionType } = require('discord.js');
const db = require("../../database/user");

client.on("interactionCreate", async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        if (interaction.commandName === 'character') {
            const focusedValue = interaction.options.getFocused();
            const text = require("../../database/ko-kr.js");
            const choices = [
                text.anby_demara || "Anby Demara",
                text.nicole_demara || "Nicole Demara",
                text.billy_kid || "Billy Kid",
                text.nekomiya_mana || "Nekomiya Mana",
                text.soldier_11 || "Soldier 11",
                text.corin_wickes || "Corin Wickes",
                text.von_lycaon || "Von Lycaon",
                text.anton_ivanov || "Anton Ivanov",
                text.koleda_belobog || "Koleda Belobog",
                text.ben_bigger || "Ben Bigger",
                text.soukaku || "Soukaku",
                text.hoshimi_miyabi || "Hoshimi Miyabi"
            ]
            const filtered = choices.filter(choice => choice.startsWith(focusedValue));
            interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice })),
            );
        }
    }
})