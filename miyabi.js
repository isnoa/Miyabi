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
  // ws: { properties: { browser: 'Discord iOS' } },
});

client.timeout = new Collection();
client.agent = new Collection();
client.slashCommands = new Collection();

require("./handler")(client);
module.exports = client;

client.login(process.env.CLIENT_TOKEN)
  .catch((err) => {
    logger.error("[CRUSH] Error from DiscordAPI :" + err);
    process.exit();
  })

const logger = require("./events/core/logger.js");
process.on('unhandledRejection', (reason, p) => {
  console.log(' [antiCrash] :: Unhandled Rejection/Catch');
  logger.error(reason, p);
  console.warn(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log(' [antiCrash] :: Uncaught Exception/Catch');
  logger.error(err, origin);
  console.log(err, origin);
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)');
  logger.error(err, origin);
  console.log(err, origin);
});
process.on('warning', (warn) => {
  console.warn(warn);
  logger.warn(warn);
});
if (process.env.NODE_ENV) {
  client.on('debug', console.log);
}
// process.on('multipleResolves', (type, promise) => {
//   console.log(' [antiCrash] :: Multiple Resolves');
//   console.log(type, promise);
// });
