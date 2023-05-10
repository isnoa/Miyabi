const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const mongoose = require("mongoose");

module.exports = async (client) => {
  // SlashCommands
  const slashCommands = await globPromise(`${process.cwd()}/cmd/*/*.js`);
  const arrayOfSlashCommands = [];
  slashCommands.map((value) => {
    const file = require(value);
    const splitted = value.split("/");
    const directory = splitted[splitted.length - 2];

    if (!file?.name) return;

    const properties = { directory, ...file };
    client.slashCommands.set(file.name, properties);

    if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
    arrayOfSlashCommands.push(file);
  });

  // Events
  const eventFiles = await globPromise(`${process.cwd()}/events/*/*.js`);
  eventFiles.map((value) => require(value));

  // SlashCommands Register
  client.once("ready", async () => {
    await client.application.commands.set(arrayOfSlashCommands);
    console.log("All SlashCommands registered.");
  });

  // mongoose DB
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.MONGO_DATABASE_URI)
  .then(() => console.log('Connected to MongoDB.'))
  .catch((err) => console.error(`File Director: (${__filename}) || Reason: ${err.message}`));
};
