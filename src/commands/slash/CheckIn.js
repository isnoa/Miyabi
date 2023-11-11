const {
  CommandInteraction,
  ApplicationCommandOptionType,
  EmbedBuilder
} = require("discord.js");
const { singleCheckIn } = require("../../events/utils/checkInAction")
const zzz = require("../../models/zzz");
const text = require("../../events/utils/TextMap.json");
const crypto = require("node:crypto");
const { env } = require("process");

module.exports = {
  name: text.SC_IS_CHECKIN_NAME,
  description: text.SC_IS_CHECKIN_DESC,
  cooldown: 30000,
  options: [{
    name: text.SC_SUB_SELCET,
    description: text.SC_SUB_SELCET_DESC,
    type: ApplicationCommandOptionType.String,
    choices: [
      { name: "지금", value: "now" },
      { name: "자동 요청하기", value: "auto_allow" },
      { name: "자동 취소하기", value: "auto_cancel" }
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
      let chosen = interaction.options.getString(text.SC_SUB_SELCET);

      const zzzData = await zzz.findOne({ where: { user_id: interaction.user.id } });
      if (!zzzData) return interaction.reply({ content: text.MISMATCHED_DATA.replace("{user}", interaction.user) });

      const cookie = await decipher(zzzData.authcookie);
      if (!isValidCookie(cookie)) return interaction.reply({ content: text.VAILD_COOKIE });

      switch (chosen) {
        case "now":
          const checkInMsg = await singleCheckIn(cookie);

          const nowEmbed = new EmbedBuilder()
            .setDescription(checkInMsg)
            .setColor(text.MIYABI_COLOR)
          interaction.reply({ embeds: [nowEmbed] })
          break;
        case "auto_allow":
          const checkInMsg = await singleCheckIn(cookie);

          await zzz.update(
            { is_checkin: true },
            { where: { user_id: interaction.user.id } }
          );
          const autoEmbed = new EmbedBuilder()
            .setDescription(`${checkInMsg}\n.이 시간부로 0시마다 너의 출석체크를 대신해 줄 거야.`)
            .setColor(text.MIYABI_COLOR)
          interaction.reply({ embeds: [autoEmbed] })
          break;
        case "auto_cancel":
          await zzz.update(
            { is_checkin: false },
            { where: { user_id: interaction.user.id } }
          );
          const autoEmbed = new EmbedBuilder()
            .setDescription("이 시간부로 0시마다 너의 출석체크를 대신하지 않도록 할게.")
            .setColor(text.MIYABI_COLOR)
          interaction.reply({ embeds: [autoEmbed] })
          break;
      }
    } catch (err) {
      interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.SRC_ISSUE).setColor(text.MIYABI_COLOR)], components: [] })
      throw err;
    }
  }
}

async function isValidCookie(cookie) {
  if (typeof cookie !== 'string') return undefined;
  const output = parseCookie(cookie);
  const requiredFields = ['ltuid', 'ltuid'];
  return requiredFields
    .map((field) => Object.keys(output).includes(field))
    .every((element) => !!element);
}

function parseCookie(cookie) {
  const output = {};
  cookie.split(/\s*;\s*/).forEach((pair) => {
    pair = pair.split(/\s*=\s*/);
    output[pair[0]] = pair.splice(1).join('=');
  });
  return output;
}

async function decipher(authcookie) {
  if (typeof authcookie !== 'string' || authcookie.trim() === '') {
    return 'Cookie is invalid or empty.';
  }

  const cookie = Buffer.from(authcookie, 'base64');

  const decipherDo = crypto.createDecipheriv(
    env.SECRET_ALGORITHM,
    env.SECRET_KEY,
    env.SECRET_IV
  );

  let decryptedCookie = decipherDo.update(cookie, 'base64', 'utf8');
  decryptedCookie += decipherDo.final('utf8');

  return decryptedCookie;
}