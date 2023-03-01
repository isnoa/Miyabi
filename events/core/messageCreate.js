// const client = require("../../miyabi");
// const clientprefix = "miyabichan?"

// client.on("messageCreate", async (message) => {
//     if (
//         message.author.bot ??
//         !message.guild ??
//         !message.content.toLowerCase().startsWith(clientprefix)
//     )
//         return;

//     const [cmd, ...args] = message.content
//         .slice(clientprefix.length)
//         .trim()
//         .split(/ +/g);

//     const messagecommand = client.commands.get(cmd.toLowerCase()) ?? client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));

//     if (!messagecommand) return;
//     await messagecommand.run(client, message, args);
// });