const client = require("../../miyabi");

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;
    if (interaction.user.bot) return;

    const args = [];

    for (const option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }

    if (command.cooldown) {
      if (client.coolDown.has(interaction.user.id))
        return interaction.reply({ content: "진정해, 페이스 유지할 시간은 충분해." });

      command.run(client, interaction);
      client.coolDown.set(interaction.user.id, Date.now() + command.cooldown);
      setTimeout(() => {
        client.coolDown.delete(interaction.user.id);
      }, command.cooldown);
    }
  }
});