require("dotenv").config();
console.clear();

// const ZZZ = require("./events/modules/zzz");
// const zzz = new ZZZ({
//   cookie: "ltoken=FfzAgAn2yVsFY4DNQk8EE9yV2Zjchkl2cp2oqsPL; ltuid=147312914;",
//   lang: "ko-kr"
// });

// console.log(zzz.getGameRecordCard().then(profile => {
//   console.log(profile);
// }))

const {
  Client,
  Collection,
  Partials,
  GatewayIntentBits,
} = require("discord.js");

const client = new Client({
  fetchAllMembers: false,
  allowedMentions: {
    parse: ["roles", "users", "everyone"],
    repliedUser: false,
  },
  partials: [
    Partials.Channel,
    Partials.User,
    Partials.GuildMember,
    Partials.ThreadMember,
    Partials.Reaction,
  ],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
  ws: { properties: { browser: 'Discord iOS' } },
});

client.agentName = new Collection();
client.coolDown = new Collection();
client.slashCommands = new Collection();

require("./events/handler")(client);
module.exports = client;

client.login(process.env.CLIENT_TOKEN)
  .catch((err) => {
    console.error('[CRUSH] :: Error from DiscordAPI: ' + err);
    process.exit();
  })

process.on('unhandledRejection', (reason, p) => {
  console.log('[antiCrash] :: Unhandled Rejection/Catch');
  console.error(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log('[antiCrash] :: Uncaught Exception/Catch');
  console.error(err, origin);
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log('[antiCrash] :: Uncaught Exception/Catch (MONITOR)');
  console.error(err, origin);
});
// process.on('multipleResolves', (type, promise) => {
//   console.log(' [antiCrash] :: Multiple Resolves');
//   console.log(type, promise);
// });
process.on('warning', (warn) => {
  console.warn(warn);
});
if (process.env.NODE_ENV === "production") {
  client.on('debug', console.log);
}

