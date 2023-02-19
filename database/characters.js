const en = require("../i18n/en-us");
const ko = require("../i18n/ko-kr");
const ja = require("../i18n/ja-jp");

const findOneCharacter = (name) => {
    if (name === "A B C D E F G") {
        return null;
    } else if (name === en.nicole_demara) {
        return "nicole_demara";
    } else if (name === ko.nicole_demara) {
        return "anby_demara";
    } else if (name === ja.nicole_demara) {
        return "anby_demara";

    } else if (name === en.anby_demara) {
        return "anby_demara";
    } else if (name === ko.anby_demara) {
        return "anby_demara";
    } else if (name === ja.anby_demara) {
        return "anby_demara";

    } else if (name === en.billy_kid) {
        return "billy_kid";
    } else if (name === ko.billy_kid) {
        return "billy_kid";
    } else if (name === ja.billy_kid) {
        return "billy_kid";

    } else if (name === en.nekomiya_mana) {
        return "nekomiya_mana";
    } else if (name === ko.nekomiya_mana) {
        return "nekomiya_mana";
    } else if (name === ja.nekomiya_mana) {
        return "nekomiya_mana";

    } else if (name === en.soldier_11) {
        return "soldier_11";
    } else if (name === ko.soldier_11) {
        return "soldier_11";
    } else if (name === ja.soldier_11) {
        return "soldier_11";

    } else if (name === en.corin_wickes) {
        return "corin_wickes";
    } else if (name === ko.corin_wickes) {
        return "corin_wickes";
    } else if (name === ja.corin_wickes) {
        return "corin_wickes";

    } else if (name === en.von_lycaon) {
        return "von_lycaon";
    } else if (name === ko.von_lycaon) {
        return "von_lycaon";
    } else if (name === ja.von_lycaon) {
        return "von_lycaon";

    } else if (name === en.anton_ivanov) {
        return "anton_ivanov";
    } else if (name === ko.anton_ivanov) {
        return "anton_ivanov";
    } else if (name === ja.anton_ivanov) {
        return "anton_ivanov";

    } else if (name === en.koleda_belobog) {
        return "koleda_belobog";
    } else if (name === ko.koleda_belobog) {
        return "koleda_belobog";
    } else if (name === ja.koleda_belobog) {
        return "koleda_belobog";

    } else if (name === en.ben_bigger) {
        return "ben_bigger";
    } else if (name === ko.ben_bigger) {
        return "ben_bigger";
    } else if (name === ja.ben_bigger) {
        return "ben_bigger";

    } else if (name === en.soukaku) {
        return "soukaku";
    } else if (name === ko.soukaku) {
        return "soukaku";
    } else if (name === ja.soukaku) {
        return "soukaku";

    } else if (name === en.hoshimi_miyabi) {
        return "hoshimi_miyabi";
    } else if (name === ko.hoshimi_miyabi) {
        return "hoshimi_miyabi";
    } else if (name === ja.hoshimi_miyabi) {
        return "hoshimi_miyabi";

    } else {
        return null;
    }
}

module.exports = {
    findOneCharacter
}