// function codeModal() {
//     const channel = client.channels.cache.get('1026469757970554965');
//     const CodeModal = new ModalBuilder()
//         .setCustomId('setDescriptionModal')
//         .setTitle('프로필 설정 : 소개')
//     const textOneInput = new TextInputBuilder()
//         .setCustomId('textOneInput')
//         .setLabel("CODE : 1")
//         .setStyle(TextInputStyle.Short)
//         .setMinLength(1)
//         .setMaxLength(20)
//         .setRequired(true)
//     const textTwoInput = new TextInputBuilder()
//         .setCustomId('textTwoInput')
//         .setLabel("CODE : 2")
//         .setStyle(TextInputStyle.Short)
//         .setMinLength(1)
//         .setMaxLength(20)
//         .setRequired(false)
//     const textThreeInput = new TextInputBuilder()
//         .setCustomId('textThreeInput')
//         .setLabel("CODE : 3")
//         .setStyle(TextInputStyle.Short)
//         .setMinLength(1)
//         .setMaxLength(20)
//         .setRequired(false)
//     const Row = new ActionRowBuilder()
//         .addComponents(
//             textOneInput, textTwoInput, textThreeInput
//         )
//     CodeModal.addComponents(Row)
//     await interaction.showModal(CodeModal);

//     if (interaction.customId === 'CodeModal') {
//         const codeOneText = interaction.fields.getTextInputValue('textOneInput');
//         const codeTwoText = interaction.fields.getTextInputValue('textTwoInput');
//         const codeThreeText = interaction.fields.getTextInputValue('textThreeInput');

//         const Embed = new EmbedBuilder()
//             .setTitle("new.ZenlessCode")
//             .setDescription(".")
//             .setColor(MiyabiColor)

//         const row = new ActionRowBuilder()
//         new ButtonBuilder()
//             .setCustomId('codeOne')
//             .setLabel(codeOneText)
//             .setStyle(ButtonStyle.Secondary)
//         new ButtonBuilder()
//             .setCustomId('codeTwo')
//             .setLabel(codeTwoText)
//             .setStyle(ButtonStyle.Secondary)
//         new ButtonBuilder()
//             .setCustomId('codeThree')
//             .setLabel(codeThreeText)
//             .setStyle(ButtonStyle.Secondary)
//         channel.send({ embeds: [Embed], components: [row] });
//     }

//     module.exports = {
//         codeModal
//     }