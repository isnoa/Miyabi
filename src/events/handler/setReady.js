const client = require("../../miyabi");
const {
  EmbedBuilder,
  ActivityType
} = require("discord.js");
const text = require("../utils/TextMap.json")

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
        if (channel.permissionsFor(client.user).has("0x0000000000000400") && channel.permissionsFor(client.user).has("0x0000000000000800")) {
          const Embed = new EmbedBuilder()
            .setTitle('반가워 「로프꾼」.')
            .setDescription('네가 뉴에리두에서 보다 편한 삶을 살 수 있도록 도울 거야.\n예를 들어.. 정원에 쌓인 눈을 쓸어 치우는 빗자루처럼, 응? 무슨 의미냐고? 글쎄. 별 것 아니야.\n\n내 도움을 받을 때는 몇 가지 인증 절차를 거쳐야 하는 경우가 있으니, 이용시 이용약관과 개인정보 처리방침을 꼭 확인해봐.\n앞으로 잘 부탁해.')
            .setColor(text.MIYABI_COLOR)
            .setThumbnail('https://cdn.discordapp.com/attachments/1019924590723612733/1169700721193668608/Faction_Section_6_Icon.webp')
          channel.send({ embeds: [Embed] })
          found = 1;
        }
      }
    }
  })
});