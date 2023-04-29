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
} = require("./ko-kr");

const findOneAgent = (name) => {
    switch (name) {
        case anby_demara:
            return "anby_demara";
        case nicole_demara:
            return "nicole_demara";
        case billy_kid:
            return "billy_kid";
        case nekomiya_mana:
            return "nekomiya_mana";
        case soldier_11:
            return "soldier_11";
        case corin_wickes:
            return "corin_wickes";
        case von_lycaon:
            return "von_lycaon";
        case anton_ivanov:
            return "anton_ivanov";
        case koleda_belobog:
            return "koleda_belobog";
        case ben_bigger:
            return "ben_bigger";
        case soukaku:
            return "soukaku";
        case hoshimi_miyabi:
            return "hoshimi_miyabi";
        default:
            return undefined;
    }
}

module.exports = { findOneAgent }