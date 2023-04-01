async function loadCommands(client) {
  const { loadFiles } = require("./fileLoader");
  
  const arrayOfSlashCommands = [];
  const Files = await loadFiles("cmd");

  Files.forEach((value) => {
    const file = require(value);
    const splitted = value.split("/");
    const directory = splitted[splitted.length - 2];

    if (!file?.name) return;

    const properties = { directory, ...file };
    client.slashCommands.set(file.name, properties);

    if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
    arrayOfSlashCommands.push(file);
})
}

module.exports = { loadCommands };