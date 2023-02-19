const {
  ContextMenuCommandInteraction,
  ApplicationCommandType,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");
const db = require("../../database/user");

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
      db.findOne({ user: interaction.user.id }, async (err, userData) => {
        if (err) throw err;
        if (userData) {
          const lang = require(`../../i18n/${userData.i18n}.js`)
          const color = interaction.member.displayHexColor;
          const Embed = new EmbedBuilder()
            .setDescription(userData.description || "-\nㅤ")
            .setFields(
              {
                name: lang.Profile_field_serviceRegistered,
                value: `<t:${parseInt(userData.since / 1000)}:R>`,
                inline: true
              },
              {
                name: lang.Profile_field_recentlySearchedCharacter,
                value: lang[userData.nowcharacter || "none"],
                inline: true
              },
              {
                name: lang.Profile_field_zzzConnect,
                value: lang[!!userData.zzzconnect || "disabled"],
                inline: true
              },
              {
                name: lang.Profile_field_dailyCheckIn,
                value: lang[userData.dailycheckin || "disabled"],
                inline: true
              }
            )
            .setThumbnail(interaction.user.avatarURL({ dynamic: true, size: 2048 }))
            .setColor(color || "#000000")

          if (userData.profileconnect === true) {
            Embed.setAuthor({ iconURL: "https://cdn.discordapp.com/emojis/1074016284292947969.png", name: lang.Profile_title_preview + ` / ${lang.Profile_userFind_LookUp}: ${lang[userData.profileconnect]}` })
          } else {
            Embed.setAuthor({ iconURL: "https://cdn.discordapp.com/emojis/1074016285836451930.png", name: lang.Profile_title_preview + ` / ${lang.Profile_userFind_LookUp}: ${lang[userData.profileconnect || "false"]}` })
          }

          if (userData.uid) {
            Embed.setTitle(interaction.user.tag + `(${userData.uid})`)
          } else {
            Embed.setTitle(interaction.user.tag)
          }

          const addRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId("add-setting-select")
              .setPlaceholder(`추가 옵션을 선택해.`)
              .setMaxValues(1)
              .addOptions([
                {
                  label: "프로필 조회 가능",
                  value: "addProfileConnect",
                  description: "프로필을 조회할 수 있게 할 수 있어."
                },
                {
                  label: "설명",
                  value: "addDescription",
                  description: "프로필 설명 추가할 수 있어."
                },
                {
                  label: "ZZZ 연동",
                  value: "addZZZConnect",
                  description: "게임 내에 정보를 볼 수 있어."
                },
                {
                  label: "출석체크",
                  value: "adddailyCheckIn",
                  description: "출석체크를 쓸 수 있어."
                },
              ])
          )
          const delRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId("del-setting-select")
              .setPlaceholder(`제거 옵션을 선택해.`)
              .setMaxValues(1)
              .addOptions([
                {
                  label: "프로필 조회 불가",
                  value: "delProfileConnect",
                  description: "프로필을 조회할 수 없게 할 수 있어."
                },
                {
                  label: "설명 제거",
                  value: "delDescription",
                  description: "프로필 설명을 제거할 수 있어."
                },
                {
                  label: "ZZZ 연동 조회 불가",
                  value: "delZZZConnect",
                  description: "ZZZ 연동 여부를 조회할 수 없게 할 수 있어."
                },
                {
                  label: "출석체크 조회 불가",
                  value: "delDailyCheckIn",
                  description: "출석체크 여부를 조회할 수 없게 할 수 있어."
                },
              ])
          )



          if (["1010159742104113162", "893424082945720351"].includes(interaction.user.id)) {
            const secretRow = new ActionRowBuilder().addComponents(
              new StringSelectMenuBuilder()
                .setCustomId("secretfunction-select")
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
            interaction.reply({ embeds: [Embed], components: [addRow, delRow, secretRow], ephemeral: true })
          } else {
            interaction.reply({ embeds: [Embed], components: [addRow, delRow], ephemeral: true })
          }
        }
      })
    } else {
      interaction.reply({ content: "<:miyabi:1073113287102840892>", ephemeral: true })
    }
  }
}