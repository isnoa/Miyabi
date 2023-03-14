const {
    CommandInteraction,
    EmbedBuilder
} = require("discord.js");
const db = require("../../database/user.js");
const logger = require("../../events/core/logger.js");

module.exports = {
    name: "탈퇴",
    description: "가입을 탈퇴하는 하는걸 도와줄게.",
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
                const Embed = new EmbedBuilder()
                .setTitle("탈퇴를 완료했어.")
                .setDescription("탈퇴는 완료 했지만 쿠키(Cookie) & UID만 제거를 한 것일뿐 명령어를 처음 쓴 일자 및 최근에 검색해본 에이전트, 프로필 공개 여부, 로그 등은 지속될거야.")
                interaction.reply({ embeds: [Embed] })
                logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Request Values: [none] || Interaction Latency: [${Math.abs(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
                db.updateOne({ user: interaction.user.id }, { $set: { zzzconnect: "", uid: "" } })
                    .catch(err => logger.error(err));
            } else {
                interaction.reply({ content: "그.. 가입 이력이 없어서 탈퇴를 못 해줘." })
            }
        })
    }
}