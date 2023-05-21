const client = require("../../miyabi.js");
const { InteractionType } = require('discord.js');
const text = require("../../modules/ko-kr.js");

client.on("interactionCreate", async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        if (interaction.commandName === '소속') {
            const focusedValue = interaction.options.getFocused();
            const choices = [
                text.gentle,
                text.unknown,
                text.victoria,
                text.belobog,
                text.section
            ];
            const filtered = choices.filter(choice => choice.startsWith(focusedValue));
            await interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice })),
            );
        }
    }
})