const client = require("../../miyabi");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const { MiyabiColor } = require("../../database/color");
const { loadCommands } = require("../../handler/commandHandler.js");

client.on("interactionCreate", async (interaction) => {
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId == "TakumiSelect") {
      interaction.values.forEach(async (value) => {
        switch (value) {
          case "codeSendToChannel":
            const CodeModal = new ModalBuilder()
              .setCustomId("CodeModal")
              .setTitle("젠존제 : 코드");
            const textOneInput = new TextInputBuilder()
              .setCustomId("textOneInput")
              .setLabel("CODE : 1")
              .setStyle(TextInputStyle.Short)
              .setMinLength(1)
              .setMaxLength(20)
              .setRequired(true);
            const textTwoInput = new TextInputBuilder()
              .setCustomId("textTwoInput")
              .setLabel("CODE : 2")
              .setStyle(TextInputStyle.Short)
              .setMinLength(1)
              .setMaxLength(20)
              .setRequired(false);
            const textThreeInput = new TextInputBuilder()
              .setCustomId("textThreeInput")
              .setLabel("CODE : 3")
              .setStyle(TextInputStyle.Short)
              .setMinLength(1)
              .setMaxLength(20)
              .setRequired(false);
            const oneRow = new ActionRowBuilder().addComponents(textOneInput);
            const twoRow = new ActionRowBuilder().addComponents(textTwoInput);
            const threeRow = new ActionRowBuilder().addComponents(textThreeInput);
            CodeModal.addComponents(oneRow, twoRow, threeRow);
            await interaction.showModal(CodeModal);
            break;
          case "reloadSlashCommands":
            loadCommands(client);
            interaction.reply({
              content: "슬레시 명령어, 리로드 완료.",
              ephemeral: true
            });
            break;
        }
      });
    }
  }
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId === "CodeModal") {
    const codeOneText = interaction.fields.getTextInputValue("textOneInput");
    const codeTwoText = interaction.fields.getTextInputValue("textTwoInput");
    const codeThreeText =
      interaction.fields.getTextInputValue("textThreeInput");

    const Embed = new EmbedBuilder()
      .setTitle("new.ZenlessCode")
      .setDescription(".")
      .setColor(MiyabiColor);

    const row = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("codeOne")
        .setLabel(codeOneText || "-")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("codeTwo")
        .setLabel(codeTwoText)
        .setStyle(ButtonStyle.Secondary || "-"),
      new ButtonBuilder()
        .setCustomId("codeThree")
        .setLabel(codeThreeText)
        .setStyle(ButtonStyle.Secondary || "-")
    );
    interaction.reply({ content: "보내졌어.", ephemeral: true });
    const channel = client.channels.cache.get("1026469757970554965");
    channel.send({ embeds: [Embed], components: [row] });
  }
});
