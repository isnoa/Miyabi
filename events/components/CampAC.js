const client = require("../../miyabi.js");
const { InteractionType } = require('discord.js');
const text = require("../../modules/ko-kr.js");

const choices = [
    { name: text.gentle, value: "gentle" },
    { name: text.unknown, value: "unknown" },
    { name: text.victoria, value: "victoria" },
    { name: text.belobog, value: "belobog" },
    { name: text.section, value: "section" }
];

client.on("interactionCreate", async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        if (interaction.commandName === '소속') {
            const focusedValue = interaction.options.getFocused();
            const filtered = choices.filter(choice => choice.name.startsWith(focusedValue));
            interaction.respond(filtered);
        }
    }
})