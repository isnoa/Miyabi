const {
  CommandInteraction,
  ApplicationCommandOptionType,
  EmbedBuilder
} = require("discord.js");
const {
  createActHoYoLABDataMachine
} = require("../../events/utils/dataMachine");
const zzz = require("../../events/models/zzz");
const text = require("../../events/utils/ko-kr");
const crypto = require("node:crypto");
const { env } = require("process");

module.exports = {
  name: text.SC_IS_DAILY_CHECK_IN_NAME,
  description: "지금/자동, 출석체크를 할 수 있어.",
  cooldown: 30000,
  options: [{
    name: "선택",
    description: "출석체크 방식을 선택해.",
    type: ApplicationCommandOptionType.String,
    choices: [
      { name: "지금", value: "now" },
      { name: "자동", value: "auto" }
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
      let chosen = interaction.options.getString("선택");

      const zzzData = await zzz.findOne({ where: { user_id: interaction.user.id } });
      if (!zzzData) return interaction.reply({ content: "너의 데이터를 찾을 수 없어.", ephemeral: true });

      const cookie = await decipher(zzzData);
      if (!isValidCookie(cookie)) return interaction.reply({ content: "잘못된 쿠키 형식이야." });

      switch (chosen) {
        case "now":
          const Embed = new EmbedBuilder()
            .setDescription(await chkIn(cookie))
            .setColor(text.ColourOfMiyabi)
          interaction.reply({ embeds: [Embed] })
          break;
        case "auto":
          console.log(cookie)
          break;
      }

      console.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
    } catch (err) {
      console.log(err)
      interaction.reply({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + text.UISrcIssue).setColor(text.ColourOfMiyabi)], components: [] })
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

async function decipher(zzzData) {
  try {
    const EncryptedCookie = zzzData.authcookie;

    if (typeof EncryptedCookie !== 'string' || EncryptedCookie.trim() === '') {
      throw new Error('Cookie is invalid or empty.');
    }

    const cookie = Buffer.from(EncryptedCookie, 'base64');

    // 암호 해독을 위해 createDecipheriv 사용
    const decipherDo = crypto.createDecipheriv(
      env.SECRET_ALGORITHM,
      env.SECRET_KEY,
      env.SECRET_IV
    );

    // 암호 해독 수행
    let decryptedCookie = decipherDo.update(cookie, 'base64', 'utf8');
    decryptedCookie += decipherDo.final('utf8');

    return decryptedCookie;
  } catch (err) {
    console.error(err)
  }
}

async function chkIn(cookie) {

  const chkInResult = await createActHoYoLABDataMachine(cookie)
    .post("https://sg-hk4e-api.hoyolab.com/event/sol/sign?act_id=e202102251931481&lang=ko-kr");

  if (chkInResult.data.retcode == '-5003') {
    return `이유: ${chkInResult.data?.message ?? '알 수 없음'} 출석체크가 이미 되어 있어.`;
  } else if (
    chkInResult.status !== 200 ||
    chkInResult.data.retcode !== 0 ||
    chkInResult.data.data?.code !== 'ok' ||
    chkInResult.data.data?.is_risk !== false
  ) {
    return `이유: ${chkInResult.data?.message ?? '알 수 없음'} 출석체크를 실패했어.`;
  } else {
    return `이유: ${chkInResult.data?.message ?? '알 수 없음'} 출석체크를 완료했어.`;
  }
}