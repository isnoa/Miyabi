const client = require("../../miyabi");
const { EmbedBuilder } = require("discord.js")
const cron = require("node-cron");
const text = require("../utils/TextMap.json")
const {
  createDataMachineHoYoLAB,
  isDecryptCookie
} = require("../../events/utils/dataMachine");
const hoyolab = require("../../models/hoyolab");
const games = require("../../models/games");

const config = {
  delayMS: 1300,
  signURL: "https://sg-hk4e-api.hoyolab.com/event/sol/sign?act_id=e202102251931481&lang=ko-kr",
  webhookURL: "https://discord.com/api/webhooks/1170798091683762216/awUNnNM0m62_Bo888gw-iws4xVMJ7rKx-3bVJpBBZsNeBVRWkVteX3TvQ8hFtmKrM5nl"
};

cron.schedule('0 0 * * *', dailyCheckIn, {
  scheduled: true,
  timezone: 'Asia/Shanghai',
});

async function singleCheckIn(authcookie) {
  const chkInResult =
    await createDataMachineHoYoLAB(authcookie)
      .post(config.signURL);

  if (chkInResult.data.retcode == '-5003') {
    console.log(chkInResult.data)
    return "# 출석체크가 이미 되어 있어.";
  } else if (
    chkInResult.data.data?.risk_code === "-5001" ||
    chkInResult.data.data?.success === 1 ||
    chkInResult.data.data?.is_risk === true
  ) {
    console.log(chkInResult.data)
    return "# 출석체크를 실패했어. 캡차(봇, 자동 감지 기능)가 발동해서 자동으로 출석체크 할 수 없어. 며칠(예상: 3일) 정도는 네가 HoYoLAB에서 직접 출석체크 하면 잘될 거야.";
  } else {
    console.log(chkInResult.data)
    return "# 출석체크를 완료했어.";
  }
}

async function dailyCheckIn() {
  let successCount = 0;
  let failureCount = 0;
  let alreadyCount = 0;

  let authCookie = await hoyolab.findAll({
    where: { is_autocheckin: true },
    attributes: [
      'user_id',
      'authcookie'
    ],

    //(join) Another DB
    include: [{
      model: games,
      attributes: [
        'zzzero',
        'honkai_3rd',
        'honkai_starrail',
        'genshin_impact'
      ]
    }]
  })
    .then(async (db) => {
      const authcookies = await Promise.all(db.map(async (profiles) => {
        const decryptResult = await isDecryptCookie(profiles.authcookie);
        return decryptResult;
      }));

      return authcookies;
    })
    .catch(error => {
      console.error(error);
    });

  for (const jobCookie of authCookie) {
    await waitFor(config.delayMS);

    const chkInResult =
      await createDataMachineHoYoLAB(jobCookie)
        .post(config.signURL);

    if (chkInResult.data.retcode == '-5003') {
      alreadyCount++;
    } else if (
      chkInResult.data.data?.risk_code === "-5001" ||
      chkInResult.data.data?.success === 1 ||
      chkInResult.data.data?.is_risk === true
    ) {
      failureCount++;
    } else {
      successCount++;
    }
  }

  const users = authCookie.length > 0 ? `${authCookie.length} 명` : '없음';
  const already = alreadyCount > 0 ? `${alreadyCount} 명` : '없음';
  const failed = failureCount > 0 ? `${failureCount} 명` : '없음';
  const succeed = successCount > 0 ? `${successCount} 명` : '없음';

  await clientNotice(users, already, failed, succeed);
}

async function clientNotice(users, already, succeed, succeed) {
  const channel = await client.channels.fetch("1095317286983847946");

  if (!channel) {
    console.error("Channel not found.");
    return;
  }

  const Embed = new EmbedBuilder()
    .setDescription('# 0시에 다시 만나자.')
    .addFields(
      { name: "이미함", value: already, inline: true },
      { name: "실패함", value: succeed, inline: true },
      { name: "완료함", value: succeed, inline: true }
    )
    .setColor(text.MIYABI_COLOR)
    .setFooter({ text: `확인수: ${users}` })
    .setTimestamp()

  return channel.send({ embeds: [Embed] });
}

async function waitFor(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  singleCheckIn
};