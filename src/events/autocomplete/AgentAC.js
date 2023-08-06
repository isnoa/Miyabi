const client = require("../../miyabi");
const { InteractionType } = require('discord.js');
const text = require("../utils/TextMap.json");

const choices = [
    { name: text.ANBY_DEMARA, value: "anby_demara" },
    { name: text.NICOLE_DEMARA, value: "nicole_demara" },
    { name: text.BILLY_KID, value: "billy_kid" },
    { name: text.NEKOMIYA_MANA, value: "nekomiya_mana" },
    { name: text.SOLDIER_11, value: "soldier_11" },
    { name: text.CORIN_WICKES, value: "corin_wickes" },
    { name: text.VON_LYCAON, value: "von_lycaon" },
    { name: text.ANTON_IVANOV, value: "anton_ivanov" },
    { name: text.KOLEDA_BELOBOG, value: "koleda_belobog" },
    { name: text.BEN_BIGGER, value: "ben_bigger" },
    { name: text.SOUKAKU, value: "soukaku" },
    { name: text.HOSHIMI_MIYABI, value: "hoshimi_miyabi" }
];

client.on("interactionCreate", async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        if (interaction.commandName === text.SC_IS_AGENT_NAME) {
            const focusedValue = interaction.options.getFocused();
            const filtered = choices.filter(choice => choice.name.startsWith(focusedValue));
            interaction.respond(filtered);
        }
    }
});