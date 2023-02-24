const {
    CommandInteraction,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");
const db = require("../../database/user");

module.exports = {
    name: "register",
    name_localizations: {
        "ko": "가입",
        "ja": "加入"
    },
    description: "Register to use commands related to 「Zenless Zone Zero」",
    description_localizations: {
        "ko": "「Zenless Zone Zero」와 관련된 명령어들을 사용할수 있도록 가입을 진행",
        "ja": "「Zenless Zone Zero」に関連するコマンドを使用できるよう加入を進行"
    },
    timeout: 5000,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        db.findOne({ user: interaction.user.id }, async (err, userData) => {
            if (err) throw err;
            if (userData) {
                const lang = require(`../../i18n/${userData.i18n}.js`);
                const ZZZConnectModal = new ModalBuilder()
                    .setCustomId('setZZZConnectModal')
                    .setTitle('ZZZ연동')
                const zzzConnectLtokenInput = new TextInputBuilder()
                    .setCustomId('zzzConnectLtokenInput')
                    .setLabel("필요한 값: ltoken")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                const zzzConnectLtuidInput = new TextInputBuilder()
                    .setCustomId('zzzConnectLtuidInput')
                    .setLabel("필요한 값: ltuid")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                const zzzConnectLtokenRow = new ActionRowBuilder().addComponents(zzzConnectLtokenInput)
                const zzzConnectLtuidRow = new ActionRowBuilder().addComponents(zzzConnectLtuidInput)
                ZZZConnectModal.addComponents(zzzConnectLtokenRow, zzzConnectLtuidRow)
                await interaction.showModal(ZZZConnectModal);
            } else {
                const ZZZConnectModal = new ModalBuilder()
                    .setCustomId('setZZZConnectModal')
                    .setTitle('ZZZConnect')
                const zzzConnectLtokenInput = new TextInputBuilder()
                    .setCustomId('zzzConnectLtokenInput')
                    .setLabel("Required Value: ltoken")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                const zzzConnectLtuidInput = new TextInputBuilder()
                    .setCustomId('zzzConnectLtuidInput')
                    .setLabel("Required Value: ltuid")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                const zzzConnectLtokenRow = new ActionRowBuilder().addComponents(zzzConnectLtokenInput)
                const zzzConnectLtuidRow = new ActionRowBuilder().addComponents(zzzConnectLtuidInput)
                ZZZConnectModal.addComponents(zzzConnectLtokenRow, zzzConnectLtuidRow)
                await interaction.showModal(ZZZConnectModal);
            }
        })
    }
}