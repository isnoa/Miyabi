const {
    nicole_demara,
    anby_demara,
    billy_kid,
    nekomiya_mana,
    soldier_11,
    corin_wickes,
    von_lycaon,
    anton_ivanov,
    koleda_belobog,
    ben_bigger,
    soukaku,
    hoshimi_miyabi
} = require("./ko-kr.js");

const findOneAgent = (name) => {
    if (name === anby_demara) {
        return "anby_demara";
    } else if (name === nicole_demara) {
        return "nicole_demara";
    } else if (name === billy_kid) {
        return "billy_kid";
    } else if (name === nekomiya_mana) {
        return "nekomiya_mana";
    } else if (name === soldier_11) {
        return "soldier_11";
    } else if (name === corin_wickes) {
        return "corin_wickes";
    } else if (name === von_lycaon) {
        return "von_lycaon";
    } else if (name === anton_ivanov) {
        return "anton_ivanov";
    } else if (name === koleda_belobog) {
        return "koleda_belobog";
    } else if (name === ben_bigger) {
        return "ben_bigger";
    } else if (name === soukaku) {
        return "soukaku";
    } else if (name === hoshimi_miyabi) {
        return "hoshimi_miyabi";
    } else {
        return undefined;
    }
}

module.exports = {
    findOneAgent
}