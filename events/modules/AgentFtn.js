const client = require("../../miyabi.js");
const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");
const axios = require("axios");
const db = require("../../database/user.js");
const { MiyabiColor } = require("../../database/color.js")
const logger = require("../core/logger.js")
const text = require("../../database/ko-kr.js")

client.on("interactionCreate", async (interaction) => {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId == "AgentSelect") {
            interaction.values.forEach(async (value) => {
                switch (value) {
                    case "Info":
                        db.findOne({ user: interaction.user.id }, async (err, userData) => {
                            if (err) throw err;
                            if (userData) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${userData.lastcharacter}.json`).then(data => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setTitle(data.data.name + " - " + text.UIAgentInfo)
                                                .setColor(data.data.colour)
                                                .setDescription(data.data.title)
                                                .setFields(
                                                    {
                                                        name: `${icon.UIExclamationmarkOne} 기본 정보`,
                                                        value: `**${text.UIAgentName}**: ${data.data.name}\n**${text.UIAgentGender}**: ${data.data.gender}\n**${text.UIAgentBirthDay}**: ██월 ██일\n**${text.UIAgentCamp}**: ${data.data.camp}`,
                                                        inline: true
                                                    },
                                                    {
                                                        name: `${icon.UIExclamationmarkTwo} 전투 정보`,
                                                        value: `**${text.UIAgentDamageAttribute}**: 얼음\n**${text.UIAgentAttackAttribute}**: 베기\n→ *에테리얼류(상성)*`,
                                                        inline: true
                                                    },
                                                    {
                                                        name: `${icon.UIMic} 성우 정보`,
                                                        value: `**일본어**: ${data.data.cv.japanese}\n**중국어**: ${data.data.cv.chinese}`,
                                                        inline: true
                                                    },
                                                    {
                                                        name: "ㅤ",
                                                        value: `${data.data.interview}\n\n${data.data.intro}`,
                                                        inline: false
                                                    }
                                                )
                                                .setThumbnail(data.data.archive.avatar)
                                            interaction.editReply({ embeds: [Embed], components: [rowAgentSelect(data)] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    console.error(err);
                                    logger.error(err);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;

                    case "Stats":
                        db.findOne({ user: interaction.user.id }, async (err, userData) => {
                            if (err) throw err;
                            if (userData) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${userData.lastcharacter}.json`).then(data => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setTitle(data.data.name + " - " + text.UIAgentStats)
                                                .setColor(data.data.colour)
                                                .setFields(
                                                    {
                                                        name: text.UIAgentEXCriteria,
                                                        value: text.UIAgentMAXLvCriteria,
                                                        inline: false
                                                    },
                                                    {
                                                        name: text.UIAgentNecessaryArticles,
                                                        value: ` · ${text.UIAgentMaterial}·${data.data.name}: ?\n · ${text.UIAgentAgentArchive}: ?`,
                                                        inline: false
                                                    },
                                                    {
                                                        name: text.UIAgentCompare,
                                                        value: `${text.FIGHT_PROP_HP}: 462 -> 5164\n${text.FIGHT_PROP_ATK}: 101 -> 1132\n${text.FIGHT_PROP_DEF}: 48 -> 567\n${text.FIGHT_PROP_IMPACT}: 110 -> 121\n${text.FIGHT_PROP_CRITICAL_RATE}: 5% -> 10%\n${text.FIGHT_PROP_CRITICAL_DMG}: 50% -> 50%\n${text.FIGHT_PROP_PENETRATION_RATIO}: 0% -> 0%\n${text.FIGHT_PROP_PENETRATION}: 0 -> 3%\n${text.FIGHT_PROP_ENERGY_RECOVERY}: 1.8 -> 1.86`,
                                                        inline: false
                                                    }
                                                )
                                                .setThumbnail(data.data.archive.avatar)
                                            const rowLevelCalculator = new ActionRowBuilder().addComponents(
                                                new StringSelectMenuBuilder()
                                                    .setCustomId("LevelCalculatorSelect")
                                                    .setPlaceholder(text.UIPlaceholderForStatsCalculator)
                                                    .setMaxValues(1)
                                                    .addOptions([
                                                        {
                                                            label: "1 ~ 10",
                                                            value: "1to10",
                                                            description: data.data.name + "의 1 ~ 10레벨까지 ",
                                                        },
                                                        {
                                                            label: "1 ~ 20",
                                                            value: "1to20",
                                                            description: data.data.name + "의 1 ~ 20레벨까지",
                                                        },
                                                        {
                                                            label: "1 ~ 30",
                                                            value: "1to30",
                                                            description: data.data.name + "의 1 ~ 30레벨까지",
                                                        },
                                                        {
                                                            label: "1 ~ 40",
                                                            value: "1to40",
                                                            description: data.data.name + "의 1 ~ 40레벨까지",
                                                        },
                                                        {
                                                            label: "1 ~ 50",
                                                            value: "1to50",
                                                            description: data.data.name + "의 1 ~ 50레벨까지",
                                                        },
                                                        {
                                                            label: "1 ~ 60",
                                                            value: "1to60",
                                                            description: data.data.name + "의 1 ~ 60레벨까지",
                                                        },
                                                        {
                                                            label: "1 ~ 70",
                                                            value: "1to70",
                                                            description: data.data.name + "의 1 ~ 70레벨까지",
                                                        },
                                                        {
                                                            label: "1 ~ 80",
                                                            value: "1to80",
                                                            description: data.data.name + "의 1 ~ 80레벨까지",
                                                        },
                                                        {
                                                            label: "1 ~ 90",
                                                            value: "1to90",
                                                            description: data.data.name + "의 1 ~ 90레벨까지",
                                                        },
                                                        {
                                                            label: "1 ~ 100",
                                                            value: "1to100",
                                                            description: data.data.name + "의 1 ~ 100레벨까지",
                                                        }
                                                    ])
                                            );
                                            interaction.editReply({ embeds: [Embed], components: [rowLevelCalculator, rowAgentSelect(data)] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    console.error(err);
                                    logger.error(err);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;

                    case "BasicAttack":
                        db.findOne({ user: interaction.user.id }, async (err, userData) => {
                            if (err) throw err;
                            if (userData) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${userData.lastcharacter}.json`).then(data => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setTitle(data.data.name + " - " + text.UIAgentBasicAttack)
                                                .setColor(data.data.colour)
                                                .setDescription("해당 캐릭터의 추천 순위는 1st, 2nd, 3rd 순이랍니다.")
                                                .setFields(
                                                    {
                                                        name: "1st (호소빌)",
                                                        value: "> 호시미 미야비\n소우카쿠\n빌리 키드",
                                                        inline: true
                                                    },
                                                    {
                                                        name: "2nd (호소코)",
                                                        value: "> 호시미 미야비\n소우카쿠\n코린 위크스",
                                                        inline: true
                                                    },
                                                    {
                                                        name: "3rd (호소앤)",
                                                        value: "> 호시미 미야비\n소우카쿠\n앤톤 이바노프",
                                                        inline: true
                                                    }
                                                )
                                                .setThumbnail(data.data.archive.avatar)
                                            interaction.editReply({ embeds: [Embed], components: [rowAgentSelect(data)] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    console.error(err);
                                    logger.error(err);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;

                    case "SpecialAttack":
                        db.findOne({ user: interaction.user.id }, async (err, userData) => {
                            if (err) throw err;
                            if (userData) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${userData.lastcharacter}.json`).then(data => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setTitle(data.data.name + " - " + text.UIAgentSpecialAttack)
                                                .setColor(data.data.colour)
                                                .setDescription("해당 캐릭터의 추천 순위는 1st, 2nd, 3rd 순이랍니다.")
                                                .setFields(
                                                    {
                                                        name: "1st (호소빌)",
                                                        value: "> 호시미 미야비\n소우카쿠\n빌리 키드",
                                                        inline: true
                                                    },
                                                    {
                                                        name: "2nd (호소코)",
                                                        value: "> 호시미 미야비\n소우카쿠\n코린 위크스",
                                                        inline: true
                                                    },
                                                    {
                                                        name: "3rd (호소앤)",
                                                        value: "> 호시미 미야비\n소우카쿠\n앤톤 이바노프",
                                                        inline: true
                                                    }
                                                )
                                                .setThumbnail(data.data.archive.avatar)
                                            interaction.editReply({ embeds: [Embed], components: [rowAgentSelect(data)] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    console.error(err);
                                    logger.error(err);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;

                    case "ComboAttack":
                        db.findOne({ user: interaction.user.id }, async (err, userData) => {
                            if (err) throw err;
                            if (userData) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${userData.lastcharacter}.json`).then(data => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setTitle(data.data.name + " - " + text.UIAgentComboAttack)
                                                .setColor(data.data.colour)
                                                .setDescription("해당 캐릭터의 추천 순위는 1st, 2nd, 3rd 순이랍니다.")
                                                .setFields(
                                                    {
                                                        name: "1st (호소빌)",
                                                        value: "> 호시미 미야비\n소우카쿠\n빌리 키드",
                                                        inline: true
                                                    },
                                                    {
                                                        name: "2nd (호소코)",
                                                        value: "> 호시미 미야비\n소우카쿠\n코린 위크스",
                                                        inline: true
                                                    },
                                                    {
                                                        name: "3rd (호소앤)",
                                                        value: "> 호시미 미야비\n소우카쿠\n앤톤 이바노프",
                                                        inline: true
                                                    }
                                                )
                                                .setThumbnail(data.data.archive.avatar)
                                            interaction.editReply({ embeds: [Embed], components: [rowAgentSelect(data)] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    console.error(err);
                                    logger.error(err);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;

                    case "Dodge":
                        db.findOne({ user: interaction.user.id }, async (err, userData) => {
                            if (err) throw err;
                            if (userData) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${userData.lastcharacter}.json`).then(data => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setTitle(data.data.name + " - " + text.UIAgentDodge)
                                                .setColor(data.data.colour)
                                                .setDescription("해당 캐릭터의 추천 순위는 1st, 2nd, 3rd 순이랍니다.")
                                                .setFields(
                                                    {
                                                        name: "1st (호소빌)",
                                                        value: "> 호시미 미야비\n소우카쿠\n빌리 키드",
                                                        inline: true
                                                    },
                                                    {
                                                        name: "2nd (호소코)",
                                                        value: "> 호시미 미야비\n소우카쿠\n코린 위크스",
                                                        inline: true
                                                    },
                                                    {
                                                        name: "3rd (호소앤)",
                                                        value: "> 호시미 미야비\n소우카쿠\n앤톤 이바노프",
                                                        inline: true
                                                    }
                                                )
                                                .setThumbnail(data.data.archive.avatar)
                                            interaction.editReply({ embeds: [Embed], components: [rowAgentSelect(data)] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    console.error(err);
                                    logger.error(err);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;

                    case "Talent":
                        db.findOne({ user: interaction.user.id }, async (err, userData) => {
                            if (err) throw err;
                            if (userData) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${userData.lastcharacter}.json`).then(data => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setTitle(data.data.name + " - " + text.UIAgentTalent)
                                                .setColor(data.data.colour)
                                                .setDescription("해당 캐릭터의 추천 순위는 1st, 2nd, 3rd 순이랍니다.")
                                                .setFields(
                                                    {
                                                        name: "1st (호소빌)",
                                                        value: "> 호시미 미야비\n소우카쿠\n빌리 키드",
                                                        inline: true
                                                    },
                                                    {
                                                        name: "2nd (호소코)",
                                                        value: "> 호시미 미야비\n소우카쿠\n코린 위크스",
                                                        inline: true
                                                    },
                                                    {
                                                        name: "3rd (호소앤)",
                                                        value: "> 호시미 미야비\n소우카쿠\n앤톤 이바노프",
                                                        inline: true
                                                    }
                                                )
                                                .setThumbnail(data.data.archive.avatar)
                                            interaction.editReply({ embeds: [Embed], components: [rowAgentSelect(data)] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    console.error(err);
                                    logger.error(err);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;

                    case "PartyRecs":
                        db.findOne({ user: interaction.user.id }, async (err, userData) => {
                            if (err) throw err;
                            if (userData) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${userData.lastcharacter}.json`).then(data => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setTitle(data.data.name + " - " + text.UIAgentPartyRecs)
                                                .setColor(data.data.colour)
                                                .setDescription(text.UIAgentOrderOfTier)
                                                .setFields(
                                                    {
                                                        name: `${text.UIAgentTierOrder1st} - 호소빌`,
                                                        value: "> 호시미 미야비\n> 소우카쿠\n> 빌리 키드",
                                                        inline: true
                                                    },
                                                    {
                                                        name: `${text.UIAgentTierOrder2nd} - 호소코`,
                                                        value: "> 호시미 미야비\n> 소우카쿠\n> 코린 위크스",
                                                        inline: true
                                                    },
                                                    {
                                                        name: `${text.UIAgentTierOrder3rd} - 호소앤`,
                                                        value: "> 호시미 미야비\n> 소우카쿠\n> 앤톤 이바노프",
                                                        inline: true
                                                    }
                                                )
                                                .setThumbnail(data.data.archive.avatar)
                                            interaction.editReply({ embeds: [Embed], components: [rowAgentSelect(data)] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    console.error(err);
                                    logger.error(err);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;
                }
            })
        }
        function rowAgentSelect(data) {
            const row = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("AgentSelect")
                    .setPlaceholder(text.UIPlaceholderForAgent)
                    .setMaxValues(1)
                    .addOptions([
                        {
                            label: text.UIAgentInfo,
                            value: "Info",
                            description: `${data.data.name}의 ${text.UIAgentInfo} 알아보기`,
                        },
                        {
                            label: text.UIAgentStats,
                            value: "Stats",
                            description: `${data.data.name}의 ${text.UIAgentStats} 알아보기`,
                        },
                        {
                            label: text.UIAgentBasicAttack,
                            value: "BasicAttack",
                            description: `${data.data.name}의 ${text.UIAgentBasicAttack} 알아보기`,
                        },
                        {
                            label: text.UIAgentSpecialAttack,
                            value: "SpecialAttack",
                            description: `${data.data.name}의 ${text.UIAgentSpecialAttack} 알아보기`,
                        },
                        {
                            label: text.UIAgentComboAttack,
                            value: "ComboAttack",
                            description: `${data.data.name}의 ${text.UIAgentComboAttack} 알아보기`,
                        },
                        {
                            label: text.UIAgentDodge,
                            value: "Dodge",
                            description: `${data.data.name}의 ${text.UIAgentDodge} 알아보기`,
                        },
                        {
                            label: text.UIAgentTalent,
                            value: "Talent",
                            description: `${data.data.name}의 ${text.UIAgentTalent} 알아보기`,
                        },
                        {
                            label: text.UIAgentPartyRecs,
                            value: "PartyRecs",
                            description: `${data.data.name}의 ${text.UIAgentPartyRecs} 알아보기`,
                        }
                    ])
            );
            return row;
        }
    }
})