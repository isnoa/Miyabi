const { WebhookClient } = require('discord.js');
const fetch = require('axios');

const { version: axios } = require('axios/package.json');
const { version: discordjs } = require('discord.js/package.json');
const { version: dotenv } = require('dotenv/package.json');
const { version: mysql2 } = require('mysql2/package.json');
const { version: sequelize } = require('sequelize/package.json');
const { version: uuid } = require('uuid/package.json');

const compareVersions = (currentVersion, latestVersion) => {
  const current = currentVersion.split('.').map(Number);
  const latest = latestVersion.split('.').map(Number);

  for (let i = 0; i < current.length; i++) {
    if (latest[i] > current[i]) {
      return 'outdated';
    } else if (latest[i] < current[i]) {
      return 'up to date';
    }
  }

  return 'up to date';
};

const checkPackageVersion = async (packageName, currentVersion) => {
  try {
    const { data } = await fetch.get(`https://registry.npmjs.org/${packageName}/latest`);
    const latestVersion = data.version;
    return {
      packageName,
      currentVersion,
      latestVersion,
      status: compareVersions(currentVersion, latestVersion)
    };
  } catch (error) {
    console.error(`Failed to fetch the latest version of ${packageName}`);
    return {
      packageName,
      currentVersion,
      latestVersion: 'Failed to fetch',
      status: 'failed'
    };
  }
};

const sendWebhookMessage = async (updates) => {
  const webhook = new WebhookClient({
    url: "https://discord.com/api/webhooks/1123985218475393206/4yla0DXLp8UneLBkFLsk-wFUYPyr_sp3N-HbtlrRfey4fwQaWxWXW04y5Q7xvJ5k8iHQ"
  });

  // 업데이트가 필요한 패키지만 필터링하여 메시지 생성
  const message = updates
    .map(update => `## ${update.packageName}: (now: ${update.currentVersion} / latest: ${update.latestVersion})`)
    .join('\n');

  const npmInstallCommands = updates
    .map(update => `${update.packageName}`)
    .join(' ');

  // 웹훅을 통해 메시지 전송
  await webhook.send("<@1010159742104113162>\n# 새로운 패키지 업데이트가 존재함\n" + message + "\n\n```bash\nnpm install " + npmInstallCommands + "\n```");
};

const runVersionChecks = async () => {
  const updates = await Promise.all([
    checkPackageVersion('axios', axios),
    checkPackageVersion('discord.js', discordjs),
    checkPackageVersion('dotenv', dotenv),
    checkPackageVersion('mysql2', mysql2),
    checkPackageVersion('sequelize', sequelize),
    checkPackageVersion('uuid', uuid)
  ]);

  // 업데이트가 필요한 패키지만 필터링하여 웹훅으로 보내기
  const packagesToUpdate = updates.filter(update => update.status === 'outdated');
  if (packagesToUpdate.length > 0) {
    await sendWebhookMessage(packagesToUpdate);
  }
};

if (process.argv[2] === "start:dev") {
  runVersionChecks();
}