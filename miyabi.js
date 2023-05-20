'use strict';
require("dotenv").config();
console.clear();

const {
  Client,
  Collection,
  Partials,
  GatewayIntentBits,
} = require("discord.js");

const client = new Client({
  fetchAllMembers: false,
  // shards: "auto",
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

client.agent = new Collection();
client.cooldown = new Collection();
client.slashCommands = new Collection();

require("./handler")(client);
module.exports = client;

client.login(process.env.CLIENT_TOKEN)
  .catch((err) => {
    console.error('[CRUSH] :: Error from DiscordAPI / ' + err);
    process.exit();
  })

process.on('unhandledRejection', (reason, p) => {
  console.log('[antiCrash] :: Unhandled Rejection/Catch');
  console.error(reason, p);
  console.warn(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log('[antiCrash] :: Uncaught Exception/Catch');
  console.error(err, origin);
  console.log(err, origin);
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log('[antiCrash] :: Uncaught Exception/Catch (MONITOR)');
  console.error(err, origin);
  console.log(err, origin);
});
process.on('warning', (warn) => {
  console.warn(warn);
  consolewarn(warn);
});
if (process.env.NODE_ENV) {
  client.on('debug', console.log);
}
// process.on('multipleResolves', (type, promise) => {
//   console.log(' [antiCrash] :: Multiple Resolves');
//   console.log(type, promise);
// });
