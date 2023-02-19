const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const mongoose = require("mongoose");

module.exports = async (client) => {

  // Dev Commands (message)
  const commandFiles = await globPromise(`${process.cwd()}/admin/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });

  // Slash Commands
  const slashCommands = await globPromise(`${process.cwd()}/commands/*/*.js`);
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
    // console.log(file)
  });

  // Events
  const eventFiles = await globPromise(`${process.cwd()}/events/*/*.js`);
  eventFiles.map((value) => require(value));

  // Slash Commands Register
  client.on("ready", async () => {
    await client.application.commands.set(arrayOfSlashCommands);
  });

  // mongoose database
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.MONGO_DATABASE_URI, () => {
  console.log("Connected to MongoDB");
});
};
