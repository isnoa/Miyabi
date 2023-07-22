const client = require("../../miyabi.js");
const { InteractionType } = require('discord.js');
const text = require("../utils/ko-kr");

const choices = [
    { name: text.anby_demara, value: "anby_demara" },
    { name: text.nicole_demara, value: "nicole_demara" },
    { name: text.billy_kid, value: "billy_kid" },
    { name: text.nekomiya_mana, value: "nekomiya_mana" },
    { name: text.soldier_11, value: "soldier_11" },
    { name: text.corin_wickes, value: "corin_wickes" },
    { name: text.von_lycaon, value: "von_lycaon" },
    { name: text.anton_ivanov, value: "anton_ivanov" },
    { name: text.koleda_belobog, value: "koleda_belobog" },
    { name: text.ben_bigger, value: "ben_bigger" },
    { name: text.soukaku, value: "soukaku" },
    { name: text.hoshimi_miyabi, value: "hoshimi_miyabi" }
];

client.on("interactionCreate", async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        if (interaction.commandName === '에이전트') {
            const focusedValue = interaction.options.getFocused();
            const filtered = choices.filter(choice => choice.name.startsWith(focusedValue));
            interaction.respond(filtered);
        }
    }
});