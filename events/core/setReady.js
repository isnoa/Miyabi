const client = require("../../miyabi");
const { EmbedBuilder, ActivityType } = require("discord.js");
const { MiyabiColor } = require("../../database/color")

client.on("ready", () => {
  console.log(`${client.user.tag} is ready for battle.`);
  client.user.setPresence({
    activities: [
      {
        name: 'Zenless Zone Zero',
        type: ActivityType.Playing,
      },
    ],
  });
})

client.on("guildCreate", async (guild) => {
  const found = 0;
  guild.channels.cache.map((channel) => {
    if (found === 0) {
      if (channel.type === 0) {
        if (channel.permissionsFor(client.user).has("VIEW_CHANNEL") === true) {
          if (channel.permissionsFor(client.user).has("SEND_MESSAGES") === true) {
            const Embed = new EmbedBuilder()
              .setTitle('「질서를 어지럽히지 마」')
              .setDescription('반가워 로프꾼. 나는 호시미 미야비야.\n내가 너를 위해 특별히 뉴에리두의 원칙과 질서를 잘 지킬 수 있도록 도와줄게. 그게 내 소임이기도 하고.\n\n내 도움을 받을떄는 특정 명령어는 자동으로 이용약관 및 개인정보 처리방침에 동의 하는 것으로 간주하니 참고해 하지만 뭘 요구하거나 중요한건 아니니 안심해.')
              .setColor(MiyabiColor)
            if (channel.permissionsFor(client.user).has("EMBED_LINKS") === true) {
                Embed.setImage('https://cdn.discordapp.com/attachments/1019924590723612733/1080400140080250880/184908dc4ea4cacdc.jpg')
            }
            channel.send({ embeds: [Embed] })
            found = 2;
          }
        }
      }
    }
  });
});