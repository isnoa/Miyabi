const {
    CommandInteraction,
    EmbedBuilder
} = require("discord.js");
const db = require("../../database/user");
const text = require("../../database/ko-kr.js");

module.exports = {
    name: "탈퇴",
    description: "ZZZ연동을 통한 기능을 사용하지 않도록 삭제.",
    timeout: 5000,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        try {
            db.findOne({ user: interaction.user.id }, async (err, userData) => {
                if (err) throw err;
                if (userData) {
                    db.updateOne({ user: interaction.user.id }, { $set: { zzzconnect: "", uid: "" } })
                        .catch(err => logger.error(err));
                } else {
                    interaction.reply({ content: "그.. 가입도 안하고 탈퇴를 해달라면 어떻게 못해줘." })
                }
            })
        } catch (err) {
            console.error(err)
            logger.error(err)
        }
    }
}