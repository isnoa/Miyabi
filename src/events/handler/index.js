const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);

module.exports = async (client) => {
  // SlashCommands
  const slashCommands = await globPromise(`${process.cwd()}/src/commands/*/*.js`);
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
  const eventFiles = await globPromise(`${process.cwd()}/src/events/*/*.js`);
  eventFiles.map((value) => require(value));

  // SlashCommands Register
  client.once("ready", async () => {
    await client.application.commands.set(arrayOfSlashCommands);
    console.info("All slashCommands registered.");
    console.info("All systems are a go.")
  });
};