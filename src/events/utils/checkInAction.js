const client = require("../../miyabi");
const { EmbedBuilder } = require("discord.js")
const axios = require("axios");
const cron = require("node-cron");
const uuid = require("uuid");
const crypto = require("node:crypto");
const { env } = require("process");

const text = require("../utils/TextMap.json")
const { createDataMachineHoYoLAB } = require("../../events/utils/dataMachine");
const zzz = require("../../models/zzz");

const config = {
  delayMS: 1300,
  signURL: "https://sg-hk4e-api.hoyolab.com/event/sol/sign?act_id=e202102251931481&lang=ko-kr",
  webhookURL: "https://discord.com/api/webhooks/1170798091683762216/awUNnNM0m62_Bo888gw-iws4xVMJ7rKx-3bVJpBBZsNeBVRWkVteX3TvQ8hFtmKrM5nl"
};

cron.schedule('0 0 * * *', dailyCheckIn, {
  scheduled: true,
  timezone: 'Asia/Shanghai',
});

async function singleCheckIn(cookie) {
  const chkInResult = await createDataMachineHoYoLAB(cookie).post(config.signURL);

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
  const succeedJobs = [];
  const alreadyJobs = [];
  const failedJobs = [];

  let signCookie = await zzz.findAll({ where: { is_authorized: true } })
    .then(users => {
      const cookies = users.map(user => {
        const encryptedCookie = Buffer.from(user.authcookie, 'base64');
        const decipher = crypto.createDecipheriv(env.SECRET_ALGORITHM, env.SECRET_KEY, env.SECRET_IV);
        let decrypted = decipher.update(encryptedCookie, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
      });

      return cookies;
    })
    .catch(error => {
      console.error(error);
    });

  for (const jobCookie of signCookie) {
    await waitFor(config.delayMS);

    const chkInResult = await createDataMachineHoYoLAB(jobCookie).post(config.signURL);

    if (chkInResult.data.retcode == '-5003') {
      alreadyJobs.push(zzz.srv_uid);
    } else if (
      chkInResult.data.data?.risk_code === "-5001" ||
      chkInResult.data.data?.success === 1 ||
      chkInResult.data.data?.is_risk === true
    ) {
      failedJobs.push(zzz.srv_uid);
    } else {
      succeedJobs.push(zzz.srv_uid);
    }
  }

  const userRes = signCookie.length > 0 ? `${signCookie.length} 명` : '없음';
  const alreadyRes = alreadyJobs.length > 0 ? `${alreadyJobs.length} 명` : '없음';
  const failedRes = failedJobs.length > 0 ? `${failedJobs.length} 명` : '없음';
  const succeedRes = succeedJobs.length > 0 ? `${succeedJobs.length} 명` : '없음';

  await clientNotice(userRes, alreadyRes, failedRes, succeedRes);
}

async function clientNotice(userRes, alreadyRes, failedRes, succeedRes) {
  const channel = await client.channels.fetch("1095317286983847946");

  if (!channel) {
    console.error("Channel not found.");
    return;
  }

  const Embed = new EmbedBuilder()
    .setDescription('# 0시에 다시 만나자.')
    .addFields(
      { name: "이미함", value: alreadyRes, inline: true },
      { name: "실패함", value: failedRes, inline: true },
      { name: "완료함", value: succeedRes, inline: true }
    )
    .setColor(text.MIYABI_COLOR)
    .setFooter({ text: `확인수: ${userRes}` })
    .setTimestamp()

  return channel.send({ embeds: [Embed] });
}

async function waitFor(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  singleCheckIn
};