const {
    CommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const { MiyabiColor } = require("../../database/color.js");
const logger = require("../../events/core/logger.js");

module.exports = {
    name: "쿠키얻기",
    description: "계정을 연동하기 위해 어떻게 쿠키 값을 얻는지 알려줄게.",
    cooldown: 5000,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const row = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                // .setCustomId("cookieWeb")
                .setLabel("PC(Web, Desktop)")
                .setStyle(ButtonStyle.Link)
                .setURL("discord://"),
            new ButtonBuilder()
                // .setCustomId("cookieMobile")
                .setLabel("Mobile(iOS, Android)")
                .setStyle(ButtonStyle.Link)
                .setURL("discord://"),
        );
        const Embed = new EmbedBuilder()
            .setTitle("쿠키에 관한 QnA")
            .setDescription("**음? 쿠키에 대해 알고 싶다고? 마침 나한테 쿠키 사용법에 대해 서류에 적어놓은게 있는데 끝까지 다 읽어보는 게 좋다고 되어있어.**\n\n***1. 쿠키란 무엇인가요?***\n쿠키란 웹사이트 접속 시 사용자의 디바이스와 웹사이트 이용 정보를 수집 및 저장되는 것입니다.\n\n***2. Miyabi는 제 쿠키로 뭘 하나요?***\nMiyabi는 HoYoLAB을 통해 연동(게임 내 정보 불러오기), 자동 출석 체크 같은 기능을 제공합니다.\n\n***3. 악용할 수도 있지 않나요?***\n맞습니다. 일반적으로 HoYoLAB에서 필요로 하는 쿠키 값은 4~5가지이지만 사실상 2가지만 있어도 이용이 가능합니다. 이 점을 이용해서 사용자분들이 조금이라도 더 안전하고 편하시도록 최소한의 정보만 수집하는 방식을 사용 중에 있으며, 미야비에게 쿠키값을 줄지는 여러분들의 믿음에 따라 다르겠지만, 개발에 몇백시간을 넘게 쓴 이 서비스가 아까워서라도 악용할 일은 맹세코 없습니다. 이익을 위해 쿠키값을 넘기거나 발설하거나 사적으로 등의 이유로 사용하지 않으며, 정보 확인 외엔 일절 사용되지 않으며 쿠키값을 확인할 수 있는 사람은 한명뿐입니다. **사용자의 계정이 해킹당하시거나 무언가 문제가 생기는 경우는 Miyabi와 아무런 관련이 없으며 책임이 없는 점을 안내해 드립니다.**")
            .setColor(MiyabiColor)
            .setFooter({ text: "MIYABI: ... 잠만 이거 내 뒷담화 아니지?" })
        interaction.reply({ embeds: [Embed], components: [row] })
        logger.info(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Request Values: [none] || Interaction Latency: [${(Date.now() - interaction.createdTimestamp)}ms] || API Latency: [${Math.round(client.ws.ping)}ms]`);
    }
}