// const { CommandInteraction } = require("discord.js");

// module.exports = {
//     name: "ping",
//     description: "returns websocket ping",
//     timeout: 5000,
//     /**
//      *
//      * @param {Client} client
//      * @param {CommandInteraction} interaction
//      * @param {String[]} args
//      */
//     run: async (client, interaction, args) => {
//         var channelObj = ["1027207051954372688", "1025677003585761320"]
//         channelObj.forEach((x) => {
//             client.channels.cache.get(x).send("yokoso kokoni, arujisama.")
//         })

//         interaction.reply("maddekudasaye, arujisame.")
//     },
// };