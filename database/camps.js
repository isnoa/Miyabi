const {
    gentle,
    unknown,
    victoria,
    belobog,
    section
} = require("../database/ko-kr.js");

const findOneCamp = (name) => {
    switch (name) {
        case gentle:
            return "gentle";
        case unknown:
            return "unknown";
        case victoria:
            return "victoria";
        case belobog:
            return "belobog";
        case section:
            return "section";
        default:
            return undefined;
    }
};

module.exports = { findOneCamp }