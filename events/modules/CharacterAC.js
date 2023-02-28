const client = require("../../miyabi");
const { InteractionType } = require('discord.js');
const text = require("../../database/ko-kr");

client.on("interactionCreate", async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        if (interaction.commandName === 'character') {
            const focusedValue = interaction.options.getFocused();
            const choices = [
                text.anby_demara,
                text.nicole_demara,
                text.billy_kid,
                text.nekomiya_mana,
                text.soldier_11,
                text.corin_wickes,
                text.von_lycaon,
                text.anton_ivanov,
                text.koleda_belobog,
                text.ben_bigger,
                text.soukaku,
                text.hoshimi_miyabi
            ]
            const filtered = choices.filter(choice => choice.startsWith(focusedValue));
            interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice })),
            );
        }
    }
})