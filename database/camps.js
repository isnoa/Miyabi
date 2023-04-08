const {
    gentleCamp,
	unknownCamp,
	victoriaCamp,
	belobogCamp,
    sectionCamp
} = require("../database/links.js");

const findOneCamp = (name) => {
    switch (name) {
        case gentleCamp.name:
            return gentleCamp.link;
        case unknownCamp.name:
            return unknownCamp.link;
        case victoriaCamp.name:
            return victoriaCamp.link;
        case belobogCamp.name:
            return belobogCamp.link;
        case sectionCamp.name:
            return sectionCamp.link;
        default:
            return undefined;
    }
};

module.exports = { findOneCamp }