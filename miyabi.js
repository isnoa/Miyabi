require("dotenv").config();
console.clear();

const {
  Client,
  Collection,
  // Options,
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
  // sweepers: {
	// 	...Options.DefaultSweeperSettings,
	// 	users: {
	// 		interval: 3600, // Every hour...
	// 		filter: user => user.bot && user.id !== client.user.id, // Remove all bots.
	// 	},
	// },
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
  ],
  // ws: { properties: { browser: 'Discord iOS' } },
});

client.timeout = new Collection();
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
// process.on('multipleResolves', (type, promise) => {
//   console.log(' [antiCrash] :: Multiple Resolves');
//   console.log(type, promise);
// });
