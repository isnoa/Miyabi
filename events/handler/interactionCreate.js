const client = require("../../miyabi.js");

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd) return;
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
    interaction.user = client.users.cache.get(interaction.user.id);

    if (cmd) {
      if (cmd.cooldown) {
        if (client.coolDown.has(`${cmd.name}${interaction.user.id}`))
          return interaction.reply({ content: "진정해, 나도 페이스 유지할 시간이 필요하다고." })
        cmd.run(client, interaction);
        client.coolDown.set(`${cmd.name}${interaction.user.id}`, Date.now() + cmd.cooldown)
        setTimeout(() => {
          client.coolDown.delete(`${cmd.name}${interaction.user.id}`)
        }, cmd.cooldown)
      }
    }
  }

  if (interaction.isContextMenuCommand()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    if (command) {
      if (command.cooldown) {
        if (client.coolDown.has(`${command.name}${interaction.user.id}`))
          return interaction.reply({ content: "진정해, 나도 페이스 유지할 시간이 필요하다고." })
        command.run(client, interaction);
        client.coolDown.set(`${command.name}${interaction.user.id}`, Date.now() + command.cooldown)
        setTimeout(() => {
          client.coolDown.delete(`${command.name}${interaction.user.id}`)
        }, command.cooldown)
      }
    }
  }
});