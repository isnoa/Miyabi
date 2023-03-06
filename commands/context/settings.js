const {
  ContextMenuCommandInteraction,
  ApplicationCommandType,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");
const { MiyabiColor } = require("../../database/color.js");

module.exports = {
  name: 'Settings',
  name_localizations: {
    "ko": "설정",
    "ja": "設定"
  },
  type: ApplicationCommandType.User,
  /**
   * 
   * @param {Client} client 
   * @param {ContextMenuCommandInteraction} interaction 
   * @param {String[]} args 
   */
  run: async (client, interaction) => {
    const userFind = interaction.user.id === interaction.targetId
    if (userFind) {
      const text = require("../../database/ko-kr.js.js");
      const Embed = new EmbedBuilder()
        .setDescription(userData.description ?? "-\nㅤ")
        .setFields(
          {
            name: text.Profile_field_serviceRegistered,
            value: `<t:${parseInt(userData.since / 1000)}:R>`,
            inline: true
          },
          {
            name: text.Profile_field_recentlySearchedAgent,
            value: text[userData.nowcharacter ?? "none"],
            inline: true
          },
          {
            name: text.Profile_field_zzzConnect,
            value: text[!!userData.zzzconnect ?? "false"],
            inline: true
          },
          {
            name: text.Profile_field_dailyCheckIn,
            value: text[userData.dailycheckin ?? "false"],
            inline: true
          }
        )
        .setThumbnail(interaction.user.avatarURL({ dynamic: true, size: 2048 }))
        .setColor(MiyabiColor)

      if (userData.profileconnect === true) {
        Embed.setAuthor({ iconURL: "https://cdn.discordapp.com/emojis/1074016284292947969.png", name: text.Profile_title_preview + ` / ${text.Profile_userFind_LookUp}: ${text[userData.profileconnect]}` })
      } else {
        Embed.setAuthor({ iconURL: "https://cdn.discordapp.com/emojis/1074016285836451930.png", name: text.Profile_title_preview + ` / ${text.Profile_userFind_LookUp}: ${text[userData.profileconnect ?? "false"]}` })
      }

      if (userData.uid) {
        Embed.setTitle(interaction.user.tag + `(${userData.uid})`)
      } else {
        Embed.setTitle(interaction.user.tag)
      }

      const ADDRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("ADDSettingSelect")
          .setPlaceholder(`추가 옵션을 선택해.`)
          .setMaxValues(1)
          .addOptions([
            {
              label: "프로필 조회 가능",
              value: "ADDProfileConnect",
              description: "프로필을 조회할 수 있게 할 수 있어."
            },
            {
              label: "설명",
              value: "ADDDescription",
              description: "프로필 설명 추가할 수 있어."
            },
            {
              label: "ZZZ 연동",
              value: "ADDZZZConnect",
              description: "게임 내에 정보를 볼 수 있어."
            },
            {
              label: "출석체크",
              value: "ADDdailyCheckIn",
              description: "출석체크를 쓸 수 있어."
            },
          ])
      )
      const DELRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("DELSettingSelect")
          .setPlaceholder(`제거 옵션을 선택해.`)
          .setMaxValues(1)
          .addOptions([
            {
              label: "프로필 조회 불가",
              value: "DELProfileConnect",
              description: "프로필을 조회할 수 없게 할 수 있어."
            },
            {
              label: "설명 제거",
              value: "DELDescription",
              description: "프로필 설명을 제거할 수 있어."
            },
            {
              label: "ZZZ 연동 조회 불가",
              value: "DELZZZConnect",
              description: "ZZZ 연동 여부를 조회할 수 없게 할 수 있어."
            },
            {
              label: "출석체크 조회 불가",
              value: "DELDailyCheckIn",
              description: "출석체크 여부를 조회할 수 없게 할 수 있어."
            },
          ])
      )



      if (["1010159742104113162", "893424082945720351"].includes(interaction.user.id)) {
        const takumiRow = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("TakumiSelect")
            .setPlaceholder("-")
            .setMaxValues(1)
            .addOptions([
              {
                label: "뉴스 채널에 신규 코드 전송",
                value: "codeSendToChannel",
                description: "-"
              },
              {
                label: "-",
                value: "-",
                description: "-"
              }
            ])
        )
        interaction.reply({ embeds: [Embed], components: [ADDRow, DELRow, takumiRow], ephemeral: true })
      } else {
        interaction.reply({ embeds: [Embed], components: [ADDRow, DELRow], ephemeral: true })
      }
    } else {
      interaction.reply({ content: "<:miyabi:1073113287102840892>", ephemeral: true })
    }
  }
}