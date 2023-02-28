const client = require("../../miyabi");
const { InteractionType } = require('discord.js');
const text = require("../../database/ko-kr");

client.on("interactionCreate", async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        if (interaction.commandName === 'camp') {
            const focusedValue = interaction.options.getFocused();
            const choices = [
                '교활한 토끼굴',
                '소속 불명',
                '빅토리아 홈서비스',
                '벨로보그 중공업',
                '대공동 6과'
            ];
            const filtered = choices.filter(choice => choice.startsWith(focusedValue));
            await interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice })),
            );
        }
    }
})