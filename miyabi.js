require("dotenv").config();
console.clear();

const {
  Client,
  Collection,
  Partials,
  GatewayIntentBits,
  EmbedBuilder,
} = require("discord.js");
const { DANGER_COLOR } = require("./events/utils/TextMap");

const client = new Client({
  fetchAllMembers: false,
  allowedMentions: {
    parse: ["roles", "users", "everyone"],
    repliedUser: false,
  },
  partials: [
    Partials.User,
    Partials.GuildMember,
    Partials.ThreadMember,
    Partials.Channel,
    Partials.Reaction,
  ],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
  ws: { properties: { browser: 'Discord iOS' } },
});

client.coolDown = new Collection();
client.slashCommands = new Collection();

require("./events/handler")(client);
module.exports = client;

client.login(process.env.CLIENT_TOKEN)
  .catch((err) => {
    console.error('[CRUSH] :: Error from DiscordAPI: ' + err);
    process.exit();
  })

const sendErrorMessage = async (errorTitle, errorMessage) => {
  try {
    const channel = await client.channels.fetch("1123984272760520794");
    const limitedErrorMessage = errorMessage.slice(0, 2000);

    channel.send({
      embeds: [new EmbedBuilder().setTitle(errorTitle).setDescription(`\`\`\`bash\n${limitedErrorMessage}\n\`\`\``).setColor(DANGER_COLOR).setTimestamp()]
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

process.on("uncaughtException", async (err, origin) => {
  console.log('[antiCrash] :: Uncaught Exception/Catch');
  console.error(err, origin);
  await sendErrorMessage("Unhandled Exception/Catch", err.stack);
});

process.on('unhandledRejection', async (err, origin) => {
  console.log('[antiCrash] :: Unhandled Rejection/Catch');
  console.error(err, origin);
  await sendErrorMessage("Unhandled Rejection/Catch", err.stack);
});

process.on('uncaughtExceptionMonitor', async (err, origin) => {
  console.log('[antiCrash] :: Uncaught Exception/Catch (MONITOR)');
  console.error(err, origin);
  await sendErrorMessage("Unhandled Exception/Catch (MONITOR)", err.stack);
});