const client = require("../../miyabi");
const {
    EmbedBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");
const db = require("../../database/user");
const logger = require("../../events/core/logger")
const text = require("../../database/ko-kr")

client.on("interactionCreate", async (interaction) => {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId == "ADDSettingSelect") {
            interaction.values.forEach(async (value) => {
                switch (value) {
                    case "ADDProfileConnect":
                        db.updateOne({ user: interaction.user.id }, { $set: { profileconnect: true } })
                            .catch(err => logger.error(err))
                            .then(updateActRow())
                        break;
                    case "ADDDescription":
                        const DescriptionModal = new ModalBuilder()
                            .setCustomId('setDescriptionModal')
                            .setTitle(text.UISettingIntroUrself)
                        const descriptionInput = new TextInputBuilder()
                            .setCustomId('descriptionInput')
                            .setLabel(text.UISettingIntroUrself)
                            .setPlaceholder('질서를 어지럽히지 마')
                            .setStyle(TextInputStyle.Paragraph)
                            .setMinLength(1)
                            .setMaxLength(200)
                            .setRequired(true)
                        const descriptionRow = new ActionRowBuilder().addComponents(descriptionInput)
                        DescriptionModal.addComponents(descriptionRow)
                        await interaction.showModal(DescriptionModal);
                        break;
                    case "ADDdailyCheckIn":
                        db.updateOne({ user: interaction.user.id }, { $set: { dailycheckin: true } })
                            .catch(err => logger.error(err))
                            .then(updateActRow())
                        break;
                }
            })
        }
        if (interaction.customId == "DELSettingSelect") {
            await interaction.values.forEach(async (value) => {
                switch (value) {
                    case "DELProfileConnect":
                        db.updateOne({ user: interaction.user.id }, { $set: { profileconnect: false } })
                            .catch(err => logger.error(err))
                            .then(updateActRow())
                        break;
                    case "DELDescription":
                        db.updateOne({ user: interaction.user.id }, { $set: { description: "-\nㅤ" } })
                            .catch(err => logger.error(err))
                            .then(updateActRow())
                        break;
                    case "DELDailyCheckIn":
                        db.updateOne({ user: interaction.user.id }, { $set: { dailycheckin: false } })
                            .catch(err => logger.error(err))
                            .then(updateActRow())
                        break;
                }
            })
        }
    }

    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'setDescriptionModal') {
        const aboutMeText = interaction.fields.getTextInputValue('descriptionInput')
        db.updateOne({ user: interaction.user.id }, { $set: { description: aboutMeText + "\nㅤ" } })
            .catch(err => logger.error(err))
            .then(updateActRow())
    }



    async function updateActRow() {
        const text = require("../../database/ko-kr.js");
        const color = interaction.member.displayHexColor;
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
            .setColor(color ?? "#000000")

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
                .ADDOptions([
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
                    // {
                    //     label: "ZZZ 연동",
                    //     value: "ADDZZZConnect",
                    //     description: "ZZZ 연동으로 게임 내에 너의 정보를 볼 수 있어."
                    // },
                    {
                        label: "출석체크",
                        value: "ADDdailyCheckIn",
                        description: "출석체크를 쓰는지 볼 수 있어."
                    },
                ])
        )
        const DELRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("DELSettingSelect")
                .setPlaceholder(`제거 옵션을 선택해.`)
                .setMaxValues(1)
                .ADDOptions([
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
                    // {
                    //     label: "ZZZ 연동 조회 불가",
                    //     value: "DELZZZConnect",
                    //     description: "ZZZ 연동 여부를 조회할 수 없게 할 수 있어."
                    // },
                    {
                        label: "출석체크 조회 불가",
                        value: "DELDailyCheckIn",
                        description: "출석체크 여부를 조회할 수 없게 할 수 있어."
                    },
                ])
        )
        await interaction.update({ embeds: [Embed], components: [ADDRow, DELRow], ephemeral: true })
    }
})