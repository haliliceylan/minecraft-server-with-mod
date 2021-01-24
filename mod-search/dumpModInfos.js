const fs = require('fs')
const curseforge = require("mc-curseforge-api");
const moment = require('moment')
const cliProgress = require('cli-progress');
const chalk = require('chalk')
const log = console.log;
const Axios = require('axios')
const Path = require('path')

function getModInfos(modId) {
    return new Promise(async (resolve) => {
        let info = await curseforge.getMod(modId);
        resolve(`>>> ${info.name}[${info.url}]\n    ${info.summary}\n`)
    })
}

async function getAllModInfos() {
    var i, j, temparray, chunk = 5;
    for (i = 0, j = mods.length; i < j; i += chunk) {
        temparray = mods.slice(i, i + chunk);
        let calls = []
        for (let i = 0; i < temparray.length; i++) {
            let modId = temparray[i].split("|")[0]
            calls.push(getModInfos(modId))
        }
        let modInfos = await Promise.all(calls);
        console.log(chalk.whiteBright(modInfos.join('\n').bold))
    }
}
mods = fs.readFileSync('mods.txt').toString().split("\n")

getAllModInfos();