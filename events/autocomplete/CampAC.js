const client = require("../../miyabi");
const { InteractionType } = require('discord.js');
const text = require("../utils/TextMap");

const choices = [
    { name: text.CAMP_GENTLE, value: "gentle" },
    { name: "알 수 없음", value: "unknown" },
    { name: text.CAMP_VICTORIA, value: "victoria" },
    { name: text.CAMP_BELOBOG, value: "belobog" },
    { name: text.CAMP_SECTION, value: "section" }
];

client.on("interactionCreate", async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        if (interaction.commandName === text.SC_IS_CAMP_NAME) {
            const focusedValue = interaction.options.getFocused();
            const filtered = choices.filter(choice => choice.name.startsWith(focusedValue));
            interaction.respond(filtered);
        }
    }
})