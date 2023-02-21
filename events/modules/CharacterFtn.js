const client = require("../../miyabi");
const axios = require("axios");
const db = require("../../database/user");
const { MiyabiColor } = require("../../database/color")
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

client.on("interactionCreate", async (interaction) => {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId == "character-select") {
            interaction.values.forEach(async (value) => {
                switch (value) {
                    case "Info":
                        db.findOne({ user: interaction.user.id }, async (err, userData) => {
                            if (err) throw err;
                            if (userData) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${userData.nowcharacter}.json`).then(data => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setAuthor({ name: "정보" })
                                                .setColor(data.data.colour)
                                                .setDescription('> ' + data.data.title)
                                                .setFields(
                                                    {
                                                        name: "ㅤ",
                                                        value: `**이름**: ${data.data.name}\n**성별**: ${data.data.gender}\n**생일**: ██월 ██일`,
                                                        inline: true
                                                    },
                                                    {
                                                        name: "ㅤ",
                                                        value: `**소속**: ${data.data.camp}\n**속성**: ██\n**체계**: ███`,
                                                        inline: true
                                                    },
                                                    {
                                                        name: "ㅤ",
                                                        value: `> ${data.data.intro}\n\n> ${data.data.interview}`
                                                    }
                                                )
                                                .setThumbnail(data.data.archive.avatar)
                                            const row = new ActionRowBuilder().addComponents(
                                                new StringSelectMenuBuilder()
                                                    .setCustomId("character-select")
                                                    .setPlaceholder(`옵션을 선택해.`)
                                                    .setMaxValues(1)
                                                    .addOptions([
                                                        {
                                                            label: "정보",
                                                            value: "Info",
                                                            description: data.data.name + "의 정보 알아보기",
                                                        },
                                                        {
                                                            label: "스텟",
                                                            value: "BaseStats",
                                                            description: data.data.name + "의 스텟 알아보기",
                                                        },
                                                        {
                                                            label: "기본공격",
                                                            value: "BasicAttack",
                                                            description: data.data.name + "의 기본공격 알아보기",
                                                        },
                                                        {
                                                            label: "특수공격",
                                                            value: "SpecialAttack",
                                                            description: data.data.name + "의 특수공격 알아보기",
                                                        },
                                                        {
                                                            label: "연계공격",
                                                            value: "ComboAttack",
                                                            description: data.data.name + "의 연계공격 알아보기",
                                                        },
                                                        {
                                                            label: "회피",
                                                            value: "Dodge",
                                                            description: data.data.name + "의 회피 알아보기",
                                                        },
                                                        {
                                                            label: "특성",
                                                            value: "Talent",
                                                            description: data.data.name + "의 특성 알아보기",
                                                        },
                                                        {
                                                            label: "추천파티",
                                                            value: "PartyRecs",
                                                            description: data.data.name + "의 추천파티 알아보기",
                                                        }
                                                    ])
                                            );
                                            interaction.editReply({ embeds: [Embed], components: [row] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    return console.error(err);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;

                    case "BaseStats":
                        db.findOne({ user: interaction.user.id }, async (err, userData) => {
                            if (err) throw err;
                            if (userData) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${userData.nowcharacter}.json`).then(data => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setAuthor({ name: data.data.name + " 기본스텟" })
                                                .setColor(data.data.colour)
                                                .setFields(
                                                    {
                                                        name: "예시 기준",
                                                        value: "캐릭터 레벨: 40(만랩)",
                                                        inline: false
                                                    },
                                                    {
                                                        name: "필요한 재화",
                                                        value: ` · 에이전트 파일·${data.data.name}: ?\n · 승진 허가장: ?`,
                                                        inline: false
                                                    },
                                                    {
                                                        name: "능력치 비교",
                                                        value: "HP: 462 -> 5164\n공격력: 101 -> 1132\n방어력: 48 -> 567\n충격력: 110 -> 121\n치명타 확률: 5% -> 10%\n치명타 피해: 50% -> 50%\n관통률: 0% -> 0%\n관통 수치: 0 -> 3%\n에너지 자동 회복: 1.8 -> 1.86",
                                                        inline: false
                                                    }
                                                )
                                                .setThumbnail(data.data.archive.avatar)
                                            const rowLevelCalculator = new ActionRowBuilder().addComponents(
                                                new StringSelectMenuBuilder()
                                                    .setCustomId("levelcalculator-select")
                                                    .setPlaceholder(`계산할 레벨을 선택해.`)
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
                                                            description: data.data.name + "의 스텟 알아보기",
                                                        },
                                                        {
                                                            label: "1 ~ 30",
                                                            value: "1to30",
                                                            description: data.data.name + "의 기본공격 알아보기",
                                                        },
                                                        {
                                                            label: "1 ~ 40",
                                                            value: "1to40",
                                                            description: data.data.name + "의 특수공격 알아보기",
                                                        }
                                                    ])
                                            );
                                            const row = new ActionRowBuilder().addComponents(
                                                new StringSelectMenuBuilder()
                                                    .setCustomId("character-select")
                                                    .setPlaceholder(`옵션을 선택해.`)
                                                    .setMaxValues(1)
                                                    .addOptions([
                                                        {
                                                            label: "정보",
                                                            value: "Info",
                                                            description: data.data.name + "의 정보 알아보기",
                                                        },
                                                        {
                                                            label: "스텟",
                                                            value: "BaseStats",
                                                            description: data.data.name + "의 스텟 알아보기",
                                                        },
                                                        {
                                                            label: "기본공격",
                                                            value: "BasicAttack",
                                                            description: data.data.name + "의 기본공격 알아보기",
                                                        },
                                                        {
                                                            label: "특수공격",
                                                            value: "SpecialAttack",
                                                            description: data.data.name + "의 특수공격 알아보기",
                                                        },
                                                        {
                                                            label: "연계공격",
                                                            value: "ComboAttack",
                                                            description: data.data.name + "의 연계공격 알아보기",
                                                        },
                                                        {
                                                            label: "회피",
                                                            value: "Dodge",
                                                            description: data.data.name + "의 회피 알아보기",
                                                        },
                                                        {
                                                            label: "특성",
                                                            value: "Talent",
                                                            description: data.data.name + "의 특성 알아보기",
                                                        },
                                                        {
                                                            label: "추천파티",
                                                            value: "PartyRecs",
                                                            description: data.data.name + "의 추천파티 알아보기",
                                                        }
                                                    ])
                                            );
                                            interaction.editReply({ embeds: [Embed], components: [rowLevelCalculator, row] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    return console.error(err);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;

                    case "BasicAttack":
                        db.findOne({ user: interaction.user.id }, async (err, userData) => {
                            if (err) throw err;
                            if (userData) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${userData.nowcharacter}.json`).then(data => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })

                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setAuthor({ name: data.data.name + " 기본공격" })
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
                                            const row = new ActionRowBuilder().addComponents(
                                                new StringSelectMenuBuilder()
                                                    .setCustomId("character-select")
                                                    .setPlaceholder(`옵션을 선택해.`)
                                                    .setMaxValues(1)
                                                    .addOptions([
                                                        {
                                                            label: "정보",
                                                            value: "Info",
                                                            description: data.data.name + "의 정보 알아보기",
                                                        },
                                                        {
                                                            label: "스텟",
                                                            value: "BaseStats",
                                                            description: data.data.name + "의 스텟 알아보기",
                                                        },
                                                        {
                                                            label: "기본공격",
                                                            value: "BasicAttack",
                                                            description: data.data.name + "의 기본공격 알아보기",
                                                        },
                                                        {
                                                            label: "특수공격",
                                                            value: "SpecialAttack",
                                                            description: data.data.name + "의 특수공격 알아보기",
                                                        },
                                                        {
                                                            label: "연계공격",
                                                            value: "ComboAttack",
                                                            description: data.data.name + "의 연계공격 알아보기",
                                                        },
                                                        {
                                                            label: "회피",
                                                            value: "Dodge",
                                                            description: data.data.name + "의 회피 알아보기",
                                                        },
                                                        {
                                                            label: "특성",
                                                            value: "Talent",
                                                            description: data.data.name + "의 특성 알아보기",
                                                        },
                                                        {
                                                            label: "추천파티",
                                                            value: "PartyRecs",
                                                            description: data.data.name + "의 추천파티 알아보기",
                                                        }
                                                    ])
                                            );
                                            interaction.editReply({ embeds: [Embed], components: [row] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    return console.error(err);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;

                    case "SpecialAttack":
                        db.findOne({ user: interaction.user.id }, async (err, userData) => {
                            if (err) throw err;
                            if (userData) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${userData.nowcharacter}.json`).then(data => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })

                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setAuthor({ name: data.data.name + " 특수공격" })
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
                                            const row = new ActionRowBuilder().addComponents(
                                                new StringSelectMenuBuilder()
                                                    .setCustomId("character-select")
                                                    .setPlaceholder(`옵션을 선택해.`)
                                                    .setMaxValues(1)
                                                    .addOptions([
                                                        {
                                                            label: "정보",
                                                            value: "Info",
                                                            description: data.data.name + "의 정보 알아보기",
                                                        },
                                                        {
                                                            label: "스텟",
                                                            value: "BaseStats",
                                                            description: data.data.name + "의 스텟 알아보기",
                                                        },
                                                        {
                                                            label: "기본공격",
                                                            value: "BasicAttack",
                                                            description: data.data.name + "의 기본공격 알아보기",
                                                        },
                                                        {
                                                            label: "특수공격",
                                                            value: "SpecialAttack",
                                                            description: data.data.name + "의 특수공격 알아보기",
                                                        },
                                                        {
                                                            label: "연계공격",
                                                            value: "ComboAttack",
                                                            description: data.data.name + "의 연계공격 알아보기",
                                                        },
                                                        {
                                                            label: "회피",
                                                            value: "Dodge",
                                                            description: data.data.name + "의 회피 알아보기",
                                                        },
                                                        {
                                                            label: "특성",
                                                            value: "Talent",
                                                            description: data.data.name + "의 특성 알아보기",
                                                        },
                                                        {
                                                            label: "추천파티",
                                                            value: "PartyRecs",
                                                            description: data.data.name + "의 추천파티 알아보기",
                                                        }
                                                    ])
                                            );
                                            interaction.editReply({ embeds: [Embed], components: [row] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    return console.error(err);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;

                    case "ComboAttack":
                        db.findOne({ user: interaction.user.id }, async (err, userData) => {
                            if (err) throw err;
                            if (userData) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${userData.nowcharacter}.json`).then(data => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setAuthor({ name: data.data.name + " 연계공격" })
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
                                            const row = new ActionRowBuilder().addComponents(
                                                new StringSelectMenuBuilder()
                                                    .setCustomId("character-select")
                                                    .setPlaceholder(`옵션을 선택해.`)
                                                    .setMaxValues(1)
                                                    .addOptions([
                                                        {
                                                            label: "정보",
                                                            value: "Info",
                                                            description: data.data.name + "의 정보 알아보기",
                                                        },
                                                        {
                                                            label: "스텟",
                                                            value: "BaseStats",
                                                            description: data.data.name + "의 스텟 알아보기",
                                                        },
                                                        {
                                                            label: "기본공격",
                                                            value: "BasicAttack",
                                                            description: data.data.name + "의 기본공격 알아보기",
                                                        },
                                                        {
                                                            label: "특수공격",
                                                            value: "SpecialAttack",
                                                            description: data.data.name + "의 특수공격 알아보기",
                                                        },
                                                        {
                                                            label: "연계공격",
                                                            value: "ComboAttack",
                                                            description: data.data.name + "의 연계공격 알아보기",
                                                        },
                                                        {
                                                            label: "회피",
                                                            value: "Dodge",
                                                            description: data.data.name + "의 회피 알아보기",
                                                        },
                                                        {
                                                            label: "특성",
                                                            value: "Talent",
                                                            description: data.data.name + "의 특성 알아보기",
                                                        },
                                                        {
                                                            label: "추천파티",
                                                            value: "PartyRecs",
                                                            description: data.data.name + "의 추천파티 알아보기",
                                                        }
                                                    ])
                                            );
                                            interaction.editReply({ embeds: [Embed], components: [row] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    return console.error(err);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;

                    case "Dodge":
                        db.findOne({ user: interaction.user.id }, async (err, userData) => {
                            if (err) throw err;
                            if (userData) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${userData.nowcharacter}.json`).then(data => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setAuthor({ name: data.data.name + " 회피" })
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
                                            const row = new ActionRowBuilder().addComponents(
                                                new StringSelectMenuBuilder()
                                                    .setCustomId("character-select")
                                                    .setPlaceholder(`옵션을 선택해.`)
                                                    .setMaxValues(1)
                                                    .addOptions([
                                                        {
                                                            label: "정보",
                                                            value: "Info",
                                                            description: data.data.name + "의 정보 알아보기",
                                                        },
                                                        {
                                                            label: "스텟",
                                                            value: "BaseStats",
                                                            description: data.data.name + "의 스텟 알아보기",
                                                        },
                                                        {
                                                            label: "기본공격",
                                                            value: "BasicAttack",
                                                            description: data.data.name + "의 기본공격 알아보기",
                                                        },
                                                        {
                                                            label: "특수공격",
                                                            value: "SpecialAttack",
                                                            description: data.data.name + "의 특수공격 알아보기",
                                                        },
                                                        {
                                                            label: "연계공격",
                                                            value: "ComboAttack",
                                                            description: data.data.name + "의 연계공격 알아보기",
                                                        },
                                                        {
                                                            label: "회피",
                                                            value: "Dodge",
                                                            description: data.data.name + "의 회피 알아보기",
                                                        },
                                                        {
                                                            label: "특성",
                                                            value: "Talent",
                                                            description: data.data.name + "의 특성 알아보기",
                                                        },
                                                        {
                                                            label: "추천파티",
                                                            value: "PartyRecs",
                                                            description: data.data.name + "의 추천파티 알아보기",
                                                        }
                                                    ])
                                            );
                                            interaction.editReply({ embeds: [Embed], components: [row] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    return console.error(err);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;

                    case "Talent":
                        db.findOne({ user: interaction.user.id }, async (err, userData) => {
                            if (err) throw err;
                            if (userData) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${userData.nowcharacter}.json`).then(data => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setAuthor({ name: data.data.name + " 특성" })
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
                                            const row = new ActionRowBuilder().addComponents(
                                                new StringSelectMenuBuilder()
                                                    .setCustomId("character-select")
                                                    .setPlaceholder(`옵션을 선택해.`)
                                                    .setMaxValues(1)
                                                    .addOptions([
                                                        {
                                                            label: "정보",
                                                            value: "Info",
                                                            description: data.data.name + "의 정보 알아보기",
                                                        },
                                                        {
                                                            label: "스텟",
                                                            value: "BaseStats",
                                                            description: data.data.name + "의 스텟 알아보기",
                                                        },
                                                        {
                                                            label: "기본공격",
                                                            value: "BasicAttack",
                                                            description: data.data.name + "의 기본공격 알아보기",
                                                        },
                                                        {
                                                            label: "특수공격",
                                                            value: "SpecialAttack",
                                                            description: data.data.name + "의 특수공격 알아보기",
                                                        },
                                                        {
                                                            label: "연계공격",
                                                            value: "ComboAttack",
                                                            description: data.data.name + "의 연계공격 알아보기",
                                                        },
                                                        {
                                                            label: "회피",
                                                            value: "Dodge",
                                                            description: data.data.name + "의 회피 알아보기",
                                                        },
                                                        {
                                                            label: "특성",
                                                            value: "Talent",
                                                            description: data.data.name + "의 특성 알아보기",
                                                        },
                                                        {
                                                            label: "추천파티",
                                                            value: "PartyRecs",
                                                            description: data.data.name + "의 추천파티 알아보기",
                                                        }
                                                    ])
                                            );
                                            interaction.editReply({ embeds: [Embed], components: [row] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    return console.error(err);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;

                    case "PartyRecs":
                        db.findOne({ user: interaction.user.id }, async (err, userData) => {
                            if (err) throw err;
                            if (userData) {
                                try {
                                    await axios.get(`https://zenlessdata.web.app/content_v2_user/app/3e9196a4b9274bd7/${userData.nowcharacter}.json`).then(data => {
                                        interaction.update({ embeds: [new EmbedBuilder().setColor(MiyabiColor).setTitle("데이터 확인중…").setDescription("이 과정은 시간을 소요할 수 있어")], components: [] })
                                        setTimeout(function setTimeAct() {
                                            const Embed = new EmbedBuilder()
                                                .setAuthor({ name: data.data.name + " 파티추천" })
                                                .setColor(data.data.colour)
                                                .setDescription("캐릭터 추천 순위는 1st, 2nd, 3rd 순이야.")
                                                .setFields(
                                                    {
                                                        name: "1st - 호소빌",
                                                        value: "> 호시미 미야비\n> 소우카쿠\n> 빌리 키드",
                                                        inline: true
                                                    },
                                                    {
                                                        name: "2nd - 호소코",
                                                        value: "> 호시미 미야비\n> 소우카쿠\n> 코린 위크스",
                                                        inline: true
                                                    },
                                                    {
                                                        name: "3rd - 호소앤",
                                                        value: "> 호시미 미야비\n> 소우카쿠\n> 앤톤 이바노프",
                                                        inline: true
                                                    }
                                                )
                                                .setThumbnail(data.data.archive.avatar)
                                            const row = new ActionRowBuilder().addComponents(
                                                new StringSelectMenuBuilder()
                                                    .setCustomId("character-select")
                                                    .setPlaceholder(`옵션을 선택해.`)
                                                    .setMaxValues(1)
                                                    .addOptions([
                                                        {
                                                            label: "정보",
                                                            value: "Info",
                                                            description: data.data.name + "의 정보 알아보기",
                                                        },
                                                        {
                                                            label: "스텟",
                                                            value: "BaseStats",
                                                            description: data.data.name + "의 스텟 알아보기",
                                                        },
                                                        {
                                                            label: "기본공격",
                                                            value: "BasicAttack",
                                                            description: data.data.name + "의 기본공격 알아보기",
                                                        },
                                                        {
                                                            label: "특수공격",
                                                            value: "SpecialAttack",
                                                            description: data.data.name + "의 특수공격 알아보기",
                                                        },
                                                        {
                                                            label: "연계공격",
                                                            value: "ComboAttack",
                                                            description: data.data.name + "의 연계공격 알아보기",
                                                        },
                                                        {
                                                            label: "회피",
                                                            value: "Dodge",
                                                            description: data.data.name + "의 회피 알아보기",
                                                        },
                                                        {
                                                            label: "특성",
                                                            value: "Talent",
                                                            description: data.data.name + "의 특성 알아보기",
                                                        },
                                                        {
                                                            label: "추천파티",
                                                            value: "PartyRecs",
                                                            description: data.data.name + "의 추천파티 알아보기",
                                                        }
                                                    ])
                                            );
                                            interaction.editReply({ embeds: [Embed], components: [row] })
                                            clearTimeout(setTimeAct)
                                        }, 2000);
                                    })
                                } catch (err) {
                                    interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터매치 실패").setDescription(`\`\`\`${err}\`\`\`\n` + "에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                                    return console.error(err);
                                }
                            } else {
                                interaction.update({ embeds: [new EmbedBuilder().setTitle("데이터인증 실패").setDescription("'401' 에러가 발생했어, 다시 시도해보거나 개발자한테 물어보는게 좋을것 같아").setColor(MiyabiColor)], components: [] })
                            }
                        })
                        break;
                }
            })
        }
    }
})