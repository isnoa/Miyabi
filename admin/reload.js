// const { Message, Client } = require("discord.js");
// const { loadCommands } = require("../handler/commandHandler.js");

// module.exports = {
//     name: "reload",
//     aliases: ['r', 'slashreload', 'reloadslash'],
//     /**
//      *
//      * @param {Client} client
//      * @param {Message} message
//      * @param {String[]} args
//      */
//     run: async (client, message, args) => {
//         if (["1010159742104113162", "893424082945720351"].includes(message.author.id)) {
//             loadCommands(client);
//             message.reply(`슬레시 명령어, 리로드 완료.`);
//         }
//     },
// };