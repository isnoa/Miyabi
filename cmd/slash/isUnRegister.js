const {
    CommandInteraction,
    EmbedBuilder
} = require("discord.js");
const db = require("../../database/user.js");
const logger = require("../../events/core/logger.js");
const { MiyabiColor } = require("../../database/color.js");

module.exports = {
    name: "탈퇴",
    description: "가입을 탈퇴하는 하는걸 도와줄게.",
    cooldown: 5000,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction) => {
        db.findOne({ userId: interaction.user.id }).then(async (user) => {
            if (user.zzzconnect && user.data && user.zzzlevel && user.uid && user.dailycheckin) {
                const Embed = new EmbedBuilder()
                .setTitle("탈퇴를 완료했어.")
                .setDescription("탈퇴는 완료 했지만 쿠키(Cookie) & UID만 제거를 한 것일뿐 명령어를 처음 쓴 일자 및 최근에 검색해본 에이전트, 프로필 공개 여부, 로그 등은 지속될거야.")
                .setColor(MiyabiColor)
                interaction.reply({ embeds: [Embed] })
                logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
                db.updateOne({ userId: interaction.user.id },
                    { $unset: { zzzconnect: 1, zzzdata: 1, zzzlevel: 1, uid: 1, dailycheckin: 1 }
                }).catch(err => logger.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
            } else {
                interaction.reply({ content: "가입 이력이 없어서 탈퇴를 못 해줘." })
            }
        }).catch((err) => {
            if (err) throw err;
        })
    }
}