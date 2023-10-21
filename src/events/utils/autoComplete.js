const client = require("../../miyabi");
const { InteractionType } = require('discord.js');
const text = require("./TextMap.json");

client.on("interactionCreate", async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {

        if (interaction.commandName === text.SC_IS_AGENT_NAME) {
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
                { name: text.HOSHIMI_MIYABI, value: "103379" }
            ];
            respond(choices);
        }

        if (interaction.commandName === text.SC_IS_CAMP_NAME) {
            const choices = [
                { name: text.CAMP_GENTLE, value: "gentle" },
                { name: "알 수 없음", value: "unknown" },
                { name: text.CAMP_VICTORIA, value: "victoria" },
                { name: text.CAMP_BELOBOG, value: "belobog" },
                { name: text.CAMP_SECTION, value: "section" }
            ];
            respond(choices);
        }

        if (interaction.commandName === text.SC_IS_FOOD_NAME) {
            const choices = [
                '검은 면기: 훈제 차슈라면',
                '흰 면기: 호박라면',
                '흰 면기: 차슈 튀김라면',
                '흰 면기: 홍고추  돈코츠라면',
                '흰 면기: 청고추 돈코츠라면',
                '흰 면기: 해물라면'
            ];
            respond(choices);
        }

        async function respond(choices) {
            const focusedValue = interaction.options.getFocused();
            const filtered = choices.filter(choice => choice.name.startsWith(focusedValue));
            return interaction.respond(filtered);
        }
    }
});