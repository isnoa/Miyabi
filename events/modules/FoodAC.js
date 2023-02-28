const client = require("../../miyabi");
const { InteractionType } = require('discord.js');
const text = require("../../database/ko-kr");

client.on("interactionCreate", async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        if (interaction.commandName === '음식') {
            const focusedValue = interaction.options.getFocused();
            const choices = [
                '검은 면기: 훈제 차슈라면',
                '흰 면기: 호박라면',
                '흰 면기: 차슈 튀김라면',
                '흰 면기: 홍고추  돈코츠라면',
                '흰 면기: 청고추 돈코츠라면',
                '흰 면기: 해물라면'
            ];
            const filtered = choices.filter(choice => choice.startsWith(focusedValue));
            await interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice })),
            );
        }
    }
});