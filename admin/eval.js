const { Message, Client } = require("discord.js");
const { inspect } = require("util");

module.exports = {
    name: "eval",
    aliases: ['e', 'ev', '검사'],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if (["1010159742104113162", "893424082945720351"].includes(message.author.id)) {
            const content = args.join(" ")
            if(!content) return;
            try {
                const result = await eval(content);
                let output = result;
                if(typeof result !== 'string') {
                    output = inspect(result)
                }
                message.channel.send({ content: "```js\n"+output+"\n```" })
            } catch (err) {
                console.error(err);
                message.channel.send({ content: "too long errors" });
            }
        }
    },
};