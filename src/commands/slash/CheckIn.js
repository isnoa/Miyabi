const {
  CommandInteraction,
  ApplicationCommandOptionType,
  EmbedBuilder
} = require("discord.js");
const {
  singleCheckIn,
  isDecryptCookie,
  isValidCookie
} = require("../../events/utils/checkInAction")
const zzz = require("../../models/zzz");
const text = require("../../events/utils/TextMap.json");
const crypto = require("node:crypto");

module.exports = {
  name: text.SC_IS_CHECKIN_NAME,
  description: text.SC_IS_CHECKIN_DESC,
  cooldown: 30000,
  options: [{
    name: text.SC_SUB_SELCET,
    description: text.SC_SUB_SELCET_DESC,
    type: ApplicationCommandOptionType.String,
    choices: [
      { name: "출석체크하기", value: "now" },
      { name: "출석체크 자동 요청하기", value: "auto_allow" },
      { name: "출석체크 자동 취소하기", value: "auto_cancel" }
    ],
    required: true
  }],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    try {
      let selectedOption = interaction.options.getString(text.SC_SUB_SELCET);

      const zzzData = await zzz.findOne({ where: { user_id: interaction.user.id } });
      if (!zzzData) return interaction.reply({ content: text.MISMATCHED_DATA.replace("{user}", interaction.user) });

      const cookie = await isDecryptCookie(zzzData.authcookie);

      if (!isValidCookie(cookie))
        return interaction.reply({ content: text.VAILD_COOKIE });

      switch (selectedOption) {
        case "now":
          const nowEmbed = new EmbedBuilder()
            .setDescription(await singleCheckIn(cookie))
            .setColor(text.MIYABI_COLOR)
          interaction.reply({ embeds: [nowEmbed] })
          break;
        case "auto_allow":
          await zzz.update(
            { is_autocheckin: true },
            { where: { user_id: interaction.user.id } }
          );

          const autoAllowEmbed = new EmbedBuilder()
            .setDescription(await singleCheckIn(cookie) + `\n.이 시간부로 0시마다 너의 출석체크를 대신해 줄 거야.`)
            .setColor(text.MIYABI_COLOR)
          interaction.reply({ embeds: [autoAllowEmbed] })
          break;
        case "auto_cancel":
          await zzz.update(
            { is_autocheckin: false },
            { where: { user_id: interaction.user.id } }
          );

          const autoCancelEmbed = new EmbedBuilder()
            .setDescription("이 시간부로 0시마다 너의 출석체크를 대신하지 않도록 할게. 내 일거리를 덜어준 것에 대해 감사를 표해.")
            .setColor(text.MIYABI_COLOR)
          interaction.reply({ embeds: [autoCancelEmbed] })
          break;
      }
    } catch (err) {
      interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.SRC_ISSUE).setColor(text.MIYABI_COLOR)], components: [] })
      throw err;
    }
  }
}

