const client = require("../../miyabi.js");
const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ComponentType
} = require("discord.js");
const axios = require("axios");
const db = require("../../database/user.js");
const { MiyabiColor } = require("../../database/color.js");
const logger = require("../core/logger.js");
const text = require("../../database/ko-kr.js");

client.on("interactionCreate", async (interaction) => {
    const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 15000 })
    const lastagent = client.agent.get(`lastagent${interaction.user.id}`)
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId == "selectAgent") {
            interaction.values.forEach(async (value) => {
                switch (value) {
                    case "Info":
                        try {
                            collector.on("collect", async (i) => {
                                if (!(i.user.id === interaction.user.id)) return i.reply({ content: "남의 것을 뺴앗는건 질서를 무너뜨리는 행동이야.", ephemeral: true })
                                await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${lastagent}.json`)
                                    .catch((err) => { if (err) throw err; }).then(async (agent) => {
                                        await i.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(async function setDelayAct() {
                                            const Embed = new EmbedBuilder()
                                                .setTitle(agent.data.name + " — " + text.UIAgentInfo)
                                                .setColor(agent.data.colour)
                                                .setDescription(replaceDescription(lastagent, agent))
                                                .setFields(
                                                    {
                                                        name: "—기본 정보",
                                                        value: `${text.UIAgentName}: ${agent.data.name}\n${text.UIAgentGender}: ${agent.data.gender}\n${text.UIAgentBirthDay}: ██월 ██일\n${text.UIAgentCamp}: ${agent.data.camp}`,
                                                        inline: true
                                                    },
                                                    {
                                                        name: "—전투 정보",
                                                        value: `${text.UIAgentDamageAttribute}: 얼음\n${text.UIAgentAttackAttribute}: 베기\n→ *에테리얼류(상성)*`,
                                                        inline: true
                                                    },
                                                    {
                                                        name: "—언어별 표기 & 성우",
                                                        value: `미국: Hoshimi Miyabi\n일본: 星見雅 (성우: ${agent.data.cv.japanese}) \n중국: 星见雅 (성우: ${agent.data.cv.chinese})\n\u200B`,
                                                        inline: false
                                                    },
                                                    {
                                                        name: "—인터뷰 & 소개",
                                                        value: `${agent.data.interview}\n\n${agent.data.intro}`,
                                                        inline: false
                                                    }
                                                )
                                                // .setFooter({ text: text.UIPleaseKnowThat })
                                                .setThumbnail(agent.data.archive.avatar)

                                            await i.editReply({ embeds: [Embed], components: [selectAgentRow()] })
                                            collector.stop()
                                            clearTimeout(setDelayAct)
                                        }, 3000);
                                    })
                            })
                        } catch (err) { i.update({ embeds: [new EmbedBuilder().setTitle("에러 발견").setDescription(`\`\`\`${err.message}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] }) }
                        break;
                    case "Stats":
                        db.findOne({ userId: interaction.user.id }).then(async (user) => {
                            if (user) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${user.lastagent}.json`).then(agent => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setTitle(agent.data.name + " — " + text.UIAgentStats)
                                                .setColor(agent.data.colour)
                                                .setFields(
                                                    {
                                                        name: text.UIAgentEXCriteria,
                                                        value: text.UIAgentMAXLvCriteria,
                                                        inline: false
                                                    },
                                                    {
                                                        name: text.UIAgentNecessaryArticles,
                                                        value: ` · ${text.UIAgentMaterial}·${agent.data.name}: ?\n · ${text.UIAgentAgentArchive}: ?`,
                                                        inline: false
                                                    },
                                                    {
                                                        name: text.UIAgentCompare,
                                                        value: `${text.FIGHT_PROP_HP}: 462 → 5164\n${text.FIGHT_PROP_ATK}: 101 → 1132\n${text.FIGHT_PROP_DEF}: 48 → 567\n${text.FIGHT_PROP_IMPACT}: 110 → 121\n${text.FIGHT_PROP_CRITICAL_RATE}: 5% → 10%\n${text.FIGHT_PROP_CRITICAL_DMG}: 50% → 50%\n${text.FIGHT_PROP_PENETRATION_RATIO}: 0% → 0%\n${text.FIGHT_PROP_PENETRATION}: 0 → 3%\n${text.FIGHT_PROP_ENERGY_RECOVERY}: 1.8 → 1.86`,
                                                        inline: false
                                                    }
                                                )
                                                // .setFooter({ text: text.UIPleaseKnowThat })
                                                .setThumbnail(agent.data.archive.avatar)
                                            interaction.editReply({ embeds: [Embed], components: [rowLevelCalculator(), selectAgentRow()] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err.message}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    console.error(err);
                                    logger.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;
                    case "BasicAttack":
                        db.findOne({ userId: interaction.user.id }).then(async (user) => {
                            if (user) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${user.lastagent}.json`).then(agent => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setTitle(agent.data.name + " — " + text.UIAgentBasicAttack)
                                                .setColor(agent.data.colour)
                                                .setDescription("해당 캐릭터의 추천 순위는 1st, 2nd, 3rd 순이랍니다.")
                                                .setFields(
                                                    {
                                                        name: "—",
                                                        value: "> 호시미 미야비\n소우카쿠\n빌리 키드",
                                                        inline: false
                                                    },
                                                    {
                                                        name: "—",
                                                        value: "> 호시미 미야비\n소우카쿠\n코린 위크스",
                                                        inline: false
                                                    },
                                                    {
                                                        name: "—",
                                                        value: "> 호시미 미야비\n소우카쿠\n앤톤 이바노프",
                                                        inline: false
                                                    }
                                                )
                                                // .setFooter({ text: text.UIPleaseKnowThat })
                                                .setThumbnail(agent.data.archive.avatar)
                                            interaction.editReply({ embeds: [Embed], components: [selectAgentRow()] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err.message}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    console.error(err);
                                    logger.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;
                    case "SpecialAttack":
                        db.findOne({ userId: interaction.user.id }).then(async (user) => {
                            if (user) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${user.lastagent}.json`).then(agent => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setTitle(agent.data.name + " — " + text.UIAgentSpecialAttack)
                                                .setColor(agent.data.colour)
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
                                                // .setFooter({ text: text.UIPleaseKnowThat })
                                                .setThumbnail(agent.data.archive.avatar)
                                            interaction.editReply({ embeds: [Embed], components: [selectAgentRow()] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err.message}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    console.error(err);
                                    logger.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;
                    case "ComboAttack":
                        db.findOne({ userId: interaction.user.id }).then(async (user) => {
                            if (user) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${user.lastagent}.json`).then(agent => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setTitle(agent.data.name + " — " + text.UIAgentComboAttack)
                                                .setColor(agent.data.colour)
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
                                                // .setFooter({ text: text.UIPleaseKnowThat })
                                                .setThumbnail(agent.data.archive.avatar)
                                            interaction.editReply({ embeds: [Embed], components: [selectAgentRow()] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err.message}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    console.error(err);
                                    logger.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;
                    case "Dodge":
                        db.findOne({ userId: interaction.user.id }).then(async (user) => {
                            if (user) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${user.lastagent}.json`).then(agent => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setTitle(agent.data.name + " — " + text.UIAgentDodge)
                                                .setColor(agent.data.colour)
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
                                                // .setFooter({ text: text.UIPleaseKnowThat })
                                                .setThumbnail(agent.data.archive.avatar)
                                            interaction.editReply({ embeds: [Embed], components: [selectAgentRow()] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err.message}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    console.error(err);
                                    logger.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;
                    case "Talent":
                        db.findOne({ userId: interaction.user.id }).then(async (user) => {
                            if (user) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${user.lastagent}.json`).then(agent => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setTitle(agent.data.name + " — " + text.UIAgentTalent)
                                                .setColor(agent.data.colour)
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
                                                // .setFooter({ text: text.UIPleaseKnowThat })
                                                .setThumbnail(agent.data.archive.avatar)
                                            interaction.editReply({ embeds: [Embed], components: [selectAgentRow()] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err.message}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    console.error(err);
                                    logger.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;
                    case "PartyRecs":
                        db.findOne({ userId: interaction.user.id }).then(async (user) => {
                            if (user) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${user.lastagent}.json`).then(agent => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setTitle(agent.data.name + " — " + text.UIAgentPartyRecs)
                                                .setColor(agent.data.colour)
                                                .setDescription(text.UIAgentOrderOfTier)
                                                .setFields(
                                                    {
                                                        name: `${text.UIAgentTierOrder1st} — 호소빌`,
                                                        value: "> 호시미 미야비\n> 소우카쿠\n> 빌리 키드",
                                                        inline: true
                                                    },
                                                    {
                                                        name: `${text.UIAgentTierOrder2nd} — 호소코`,
                                                        value: "> 호시미 미야비\n> 소우카쿠\n> 코린 위크스",
                                                        inline: true
                                                    },
                                                    {
                                                        name: `${text.UIAgentTierOrder3rd} — 호소앤`,
                                                        value: "> 호시미 미야비\n> 소우카쿠\n> 앤톤 이바노프",
                                                        inline: true
                                                    }
                                                )
                                                // .setFooter({ text: text.UIPleaseKnowThat })
                                                .setThumbnail(agent.data.archive.avatar)
                                            interaction.editReply({ embeds: [Embed], components: [selectAgentRow()] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err.message}\`\`\`\n` + "다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    console.error(err);
                                    logger.error(`File Director: (${__filename}) || User Id: [${interaction.user.id}] || Reason: ${err.message}`);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;
                }
            })
        }
    }
})

function replaceDescription(lastagent, agent) {
    if (lastagent === "soukaku") { return `> ${(agent.data.title).replace(/\n/i, " ").replace(/면/i, "면\n>")}` }
    else if (lastagent === "ben_bigger") { return `> ${(agent.data.title).replace(/\n/i, " ").replace(/을/i, "을\n>")}` }
    else { return `> ${(agent.data.title).replace(/\n/i, "\n> ")}` }
}

function selectAgentRow() {
    const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId("selectAgent")
            .setPlaceholder(text.UIPlaceholderForAgent)
            .setMaxValues(1)
            .addOptions([
                { label: text.UIAgentInfo, value: "Info" },
                { label: text.UIAgentStats, value: "Stats" },
                { label: text.UIAgentBasicAttack, value: "BasicAttack" },
                { label: text.UIAgentSpecialAttack, value: "SpecialAttack" },
                { label: text.UIAgentComboAttack, value: "ComboAttack" },
                { label: text.UIAgentDodge, value: "Dodge" },
                { label: text.UIAgentTalent, value: "Talent" },
                { label: text.UIAgentPartyRecs, value: "PartyRecs" }
            ])
    );
    return row;
}

function rowLevelCalculator() {
    const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId("selectLevel")
            .setPlaceholder(text.UIPlaceholderForStatsCalculator)
            .setMaxValues(1)
            .addOptions([
                { label: "1레벨 — 10레벨", value: "1to10" },
                { label: "1레벨 — 20레벨", value: "1to20" },
                { label: "1레벨 — 30레벨", value: "1to30" },
                { label: "1레벨 — 40레벨", value: "1to40" },
                { label: "1레벨 — 50레벨", value: "1to50" },
                { label: "1레벨 — 60레벨", value: "1to60" },
                { label: "1레벨 — 70레벨", value: "1to70" },
                { label: "1레벨 — 80레벨", value: "1to80" },
                { label: "1레벨 — 90레벨", value: "1to90" },
                { label: "1레벨 — 100레벨", value: "1to100" }
            ])
    );
    return row;
}
