const client = require("../../miyabi.js");

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd)
      return interaction.reply({ content: "An error has occurred" });

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
      if(cmd.timeout) {
        if(client.timeout.has(`${cmd.name}${interaction.user.id}`))
        return interaction.reply({ content: "진정해, 페이스 유지가 최선이야" })
        cmd.run(client, interaction, args)
        client.timeout.set(`${cmd.name}${interaction.user.id}`, Date.now() + cmd.timeout)
        setTimeout(() => {
            client.timeout.delete(`${cmd.name}${interaction.user.id}`)
        }, cmd.timeout)
    }
    }
    // cmd.run(client, interaction, args);
  }

  if (interaction.isContextMenuCommand()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (command) command.run(client, interaction);
  }
});
//https://sourceb.in/9H9ZUUbPhL