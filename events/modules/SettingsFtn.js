const client = require("../../miyabi");
const {
    EmbedBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");
const uuid = require("uuid");
const db = require("../../database/user");

client.on("interactionCreate", async (interaction) => {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId == "add-setting-select") {
            interaction.values.forEach(async (value) => {
                switch (value) {
                    case "addProfileConnect":
                        db.updateOne({ user: interaction.user.id }, { $set: { profileconnect: true } })
                            .catch(err => console.error(err))
                            .then(updateActRow())
                        break;
                    case "addDescription":
                        const DescriptionModal = new ModalBuilder()
                            .setCustomId('setDescriptionModal')
                            .setTitle('프로필 설정 : 소개')
                        const descriptionInput = new TextInputBuilder()
                            .setCustomId('descriptionInput')
                            .setLabel("너에 대해 소개해봐.")
                            .setPlaceholder('Order cannot be broken.')
                            .setStyle(TextInputStyle.Paragraph)
                            .setMinLength(1)
                            .setMaxLength(200)
                            .setRequired(true)
                        const descriptionRow = new ActionRowBuilder().addComponents(descriptionInput)
                        DescriptionModal.addComponents(descriptionRow)
                        await interaction.showModal(DescriptionModal);
                        break;
                    case "addZZZConnect":
                        const ZZZConnectModal = new ModalBuilder()
                            .setCustomId('setZZZConnectModal')
                            .setTitle('프로필 설정 : ZZZ연동')
                        const zzzConnectInput = new TextInputBuilder()
                            .setCustomId('zzzConnectInput')
                            .setLabel("필요한 값: ltoken, ltuid")
                            /** .setValue('ltoken=????????????????????????????????????????; ltuid=?????????; mi18nLang=??-??; _MHYUUID=????????-????-????-????-????????????;') */
                            .setStyle(TextInputStyle.Short)
                            .setMinLength(36)
                            .setMaxLength(150)
                            .setRequired(true)
                        const zzzConnectRow = new ActionRowBuilder().addComponents(zzzConnectInput)
                        ZZZConnectModal.addComponents(zzzConnectRow)
                        await interaction.showModal(ZZZConnectModal);
                        break;
                    case "adddailyCheckIn":
                        db.updateOne({ user: interaction.user.id }, { $set: { dailycheckin: true } })
                            .catch(err => console.error(err))
                            .then(updateActRow())
                        break;
                }
            })
        }
        if (interaction.customId == "del-setting-select") {
            await interaction.values.forEach(async (value) => {
                switch (value) {
                    case "delProfileConnect":
                        db.updateOne({ user: interaction.user.id }, { $set: { profileconnect: false } })
                            .catch(err => console.error(err))
                            .then(updateActRow())
                        break;
                    case "delDescription":
                        db.updateOne({ user: interaction.user.id }, { $set: { description: "-\nㅤ" } })
                            .catch(err => console.error(err))
                            .then(updateActRow())
                        break;
                    case "delZZZConnect":
                        db.updateOne({ user: interaction.user.id }, { $set: { zzzconnect: "" } })
                            .catch(err => console.error(err))
                            .then(updateActRow())
                        break;
                    case "delDailyCheckIn":
                        db.updateOne({ user: interaction.user.id }, { $set: { dailycheckin: false } })
                            .catch(err => console.error(err))
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
            .catch(err => console.error(err))
            .then(updateActRow())
    }
    if (interaction.customId === 'setZZZConnectModal') {
        const zzzConnectText = interaction.fields.getTextInputValue('zzzConnectInput')
        db.findOne({ user: interaction.user.id }, async (err, userData) => {
            if (err) throw err;
            if (userData) {
                userData.updateOne({ $set: { zzzconnect: zzzConnectText + ` mi18nLang=${userData.i18n}; _MHYUUID=${uuid.v4()};` } })
                    .catch(err => console.error(err))
                    .then(updateActRow())
            }
        })
    }



    function updateActRow() {
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
                                description: "ZZZ 연동으로 게임 내에 너의 정보를 볼 수 있어."
                            },
                            {
                                label: "출석체크",
                                value: "adddailyCheckIn",
                                description: "출석체크를 쓰는지 볼 수 있어."
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
                await interaction.update({ embeds: [Embed], components: [addRow, delRow], ephemeral: true })
            }
        })
    }
})