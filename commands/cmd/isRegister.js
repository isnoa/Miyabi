const {
    CommandInteraction,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");
const text = require("../../database/ko-kr.js");

module.exports = {
    name: "가입",
    description: "「Zenless Zone Zero」와 관련된 명령어들을 사용할 수 있도록 해줄게.",
    timeout: 5000,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const ZZZConnectModal = new ModalBuilder()
            .setCustomId('setZZZConnectModal')
            .setTitle(text.UISettingZZZConnect)
        const zzzConnectLtokenInput = new TextInputBuilder()
            .setCustomId('zzzConnectLtokenInput')
            .setLabel(`${text.UISettingREQValue}: ltoken`)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        const zzzConnectLtuidInput = new TextInputBuilder()
            .setCustomId('zzzConnectLtuidInput')
            .setLabel(`${text.UISettingREQValue}: ltuid`)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        const zzzConnectLtokenRow = new ActionRowBuilder().addComponents(zzzConnectLtokenInput)
        const zzzConnectLtuidRow = new ActionRowBuilder().addComponents(zzzConnectLtuidInput)
        ZZZConnectModal.addComponents(zzzConnectLtokenRow, zzzConnectLtuidRow)
        await interaction.showModal(ZZZConnectModal);
    }
}