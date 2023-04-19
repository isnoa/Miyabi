'use strict';
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
     */
    run: async (client, interaction) => {
        db.findOne({ userId: interaction.user.id }).then(async (user) => {
            if (user.zzzConnect && user.data && user.zzzLevel && user.uid && user.dailyCheckIn) {
                const Embed = new EmbedBuilder()
                    .setTitle("탈퇴를 완료했어.")
                    .setDescription("탈퇴는 완료 했지만 쿠키(Cookie) & UID만 제거를 한 것일뿐 명령어를 처음 쓴 일자 및 최근에 검색해본 에이전트, 프로필 공개 여부, 로그 등은 지속될거야.")
                    .setColor(MiyabiColor)
                await interaction.reply({ embeds: [Embed] })
                logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
                db.updateOne({ userId: interaction.user.id },
                    {
                        $unset: { zzzConnect: 1, zzzData: 1, zzzLevel: 1, uid: 1, dailyCheckIn: 1 }
                    }).catch(err => logger.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`));
            } else {
                interaction.reply({ content: "가입 이력이 없어서 탈퇴를 못 해줘." })
            }
        }).catch((err) => {
            if (err) throw err;
        })
    }
}