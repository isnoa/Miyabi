const client = require("../../miyabi");
const axios = require("axios");
const cron = require("node-cron");
const uuid = require("uuid");
const crypto = require("node:crypto");
const { env } = require("process");

const db = require("../../models/zzz");

const config = {
  delayMS: 1300,
  zzzSignURL: "https://sg-hk4e-api.hoyolab.com/event/sol/sign?act_id=e202102251931481&lang=ko-kr",
  webhookURL: "https://discord.com/api/webhooks/1170798091683762216/awUNnNM0m62_Bo888gw-iws4xVMJ7rKx-3bVJpBBZsNeBVRWkVteX3TvQ8hFtmKrM5nl"
};

async function singleCheckIn(cookie) {
  const chkInResult = await createDataMachineHoYoLAB(cookie).post(zzzSignURL);

  if (chkInResult.data.retcode == '-5003') {
    return `이유: ${chkInResult.data?.message ?? '알 수 없음'} 출석체크가 이미 되어 있어.`;
  } else if (
    chkInResult.status !== 200 ||
    chkInResult.data.retcode !== 0 ||
    chkInResult.data.data?.code !== 'ok' ||
    chkInResult.data.data?.is_risk !== false
  ) {
    console.log(chkInResult.data)
    return `출석체크를 실패했어. 캡차(봇, 자동 감지 기능)이 탑재 되어있어서 출석 못 하게 되어 자동출석이 불가능한 상태야. 며칠(예상: 3일) 정도는 네가 출석체크를 해주면 잘 될 거야.`;
  } else {
    return `이유: ${chkInResult.data?.message ?? '알 수 없음'} 출석체크를 완료했어.`;
  }
}

// webhookNotice(cookies.length);

function webhookNotice(signedCookiesLength) {
  const body = JSON.stringify({
    embeds: [
      {
        title: "응애 나 아기 미야비",
        description: `오늘자 출석 완료 (${signedCookiesLength})`,
        color: 0x313157,
        footer: {
          text: "응애"
        },
        timestamp: new Date(),
      }
    ],
  });
  return axios.post(config.webhookURL, body, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  })
}

async function waitFor(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}