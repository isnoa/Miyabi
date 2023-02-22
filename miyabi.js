require("dotenv").config();
console.clear();
// https://arca.live/b/zenlesszonezero/55939456

const {
  Client,
  Collection,
  Partials,
  GatewayIntentBits,
} = require("discord.js");

const client = new Client({
  // messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  // shards: "auto",
  allowedMentions: {
    parse: ["roles", "users", "everyone"],
    repliedUser: false,
  },
  partials: [
    // Partials.Message,
    Partials.Channel,
    Partials.User,
    Partials.GuildMember,
    Partials.ThreadMember,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
  ],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    // GatewayIntentBits.GuildMessages,
    // GatewayIntentBits.DirectMessages,
    // GatewayIntentBits.MessageContent,
  ],
  // ws: { properties: { browser: 'Discord iOS' } },
});

client.timeout = new Collection();
client.commands = new Collection();
client.slashCommands = new Collection();

require("./handler")(client);
module.exports = client;
client.login(process.env.CLIENT_TOKEN)
  .catch((err) => {
    console.log("[CRUSH] Something went wrong while connecting to Miyabi" + "\n");
    console.error("[CRUSH] Error from DiscordAPI :" + err);
    process.exit();
  })

const logger = require("./events/core/logger");

process.on('unhandledRejection', (reason, p) => {
  console.log(' [antiCrash] :: Unhandled Rejection/Catch');
  console.error(reason, p);
  logger.error(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log(' [antiCrash] :: Uncaught Exception/Catch');
  logger.error(err, origin);
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)');
  logger.error(err, origin);
});

process.on('warning', (warn) => {
  console.warn(warn);
  logger.warn(warn);
});

// process.on('multipleResolves', (type, promise) => {
//   console.log(' [antiCrash] :: Multiple Resolves');
//   console.log(type, promise);
// });
