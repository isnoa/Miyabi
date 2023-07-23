const client = require("../../miyabi.js");
const {
  EmbedBuilder,
  ActivityType
} = require("discord.js");
const text = require("../../events/utils/ko-kr")

client.once("ready", () => {
  console.log(`${client.user.username} is ready for battle.`);
  client.user.setPresence({
    activities: [
      {
        name: 'Zenless Zone Zero',
        type: ActivityType.Competing,
      },
    ],
  });
})

client.on("guildCreate", guild => {
  let found = 0;
  guild.channels.cache.map((channel) => {
    if (found === 0) {
      if (channel.type === 0) {
        if (channel.permissionsFor(client.user).has("0x0000000000000400")) {
          if (channel.permissionsFor(client.user).has("0x0000000000000800")) {
            const Embed = new EmbedBuilder()
              .setTitle('「질서를 어지럽히지 마」')
              .setDescription('반가워 로프꾼. 나는 미야비야.\n내가 너를 위해 특별히 뉴에리두의 원칙과 질서를 잘 지킬 수 있도록 도와줄게. 그게 내 소임이거든.\n\n내 도움을 받을떄는 특정 명령어는 자동으로 이용약관 및 개인정보 처리방침에 동의 하는 것으로 간주하니 참고해 하지만 뭘 요구하거나 중요한건 아니니 안심해.')
              .setColor(text.MIYABI_COLOR)
              .setImage('https://cdn.discordapp.com/attachments/1019924590723612733/1080400140080250880/184908dc4ea4cacdc.jpg')
            channel.send({ embeds: [Embed] })
            found = 1;
          }
        }
      }
    }
  });
});