const client = require("../../miyabi");
const axios = require("axios");
const cron = require("node-cron");
const uuid = require("uuid");
const crypto = require("node:crypto");
const { env } = require("process");

const db = require("../../models/zzz");

const config = {
    delayMS: 1300,
    zzzSignURI: "https://sg-hk4e-api.hoyolab.com/event/sol/sign?act_id=e202102251931481&lang=ko-kr",
    webhookURL: ""
};

async function waitFor(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}