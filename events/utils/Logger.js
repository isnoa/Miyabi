const { EmbedBuilder } = require("discord.js");
const text = require("./ko-kr");

function LogEvent(req) {
    switch (req) {
        case normal:
            ({
                embeds: [new EmbedBuilder()
                    .setTitle("에러 발견")
                    .setDescription(`\`\`\`${err.message}\`\`\`\n` + text.SRC_ISSUE)
                    .setColor(text.MIYABI_COLOR)
                ],
                components: []
            })
            break;
        case error:
            ({
                embeds: [new EmbedBuilder()
                    .setTitle("에러 발견")
                    .setDescription(`\`\`\`${err.message}\`\`\`\n` + text.SRC_ISSUE)
                    .setColor(text.MIYABI_COLOR)
                ],
                components: []
            })
            break;
    }
}

module.exports = LogEvent;