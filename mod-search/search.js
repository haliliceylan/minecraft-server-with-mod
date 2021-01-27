const fs = require('fs')
const curseforge = require("mc-curseforge-api");
const cliProgress = require('cli-progress');
const chalk = require('chalk')
const log = console.log;
const Axios = require('axios')
const Path = require('path')

let mods = []
let modFiles = []

async function getLatestFile(modId, version) {
    let files = await curseforge.getModFiles(modId)
    //Find stable if exists 
    filteredFiles = files.filter((f) => f.minecraft_versions.includes(version) && f.release_type == 1)
    filteredFiles.sort((f1, f2) => new Date(f2.timestamp) - new Date(f1.timestamp))
    let latestFile = filteredFiles[0]
    if(latestFile) {
        return latestFile
    }
    filteredFiles = files.filter((f) => f.minecraft_versions.includes(version))
    filteredFiles.sort((f1, f2) => new Date(f2.timestamp) - new Date(f1.timestamp))
    latestFile = filteredFiles[0]
    return latestFile
}


async function getMods() {
    log(chalk.whiteBright('[+] Getting mod files').bold)
    var i, j, temparray, chunk = 20;
    for (i = 0, j = mods.length; i < j; i += chunk) {
        temparray = mods.slice(i, i + chunk);
        
        let calls = []
        for (let i = 0; i < temparray.length; i++) {
            let modData = temparray[i]
            calls.push(downloadMod('mods', modData.split("|")[0],modData.split("|")[1]))
        }
        await Promise.all(calls);
        // do whatever
    }
}
function downloadMod(outputDir, modId, version) {
    return new Promise(async (resolve) => {
        let modFile = await getLatestFile(modId, version)
        let url = modFile.download_url
        let splitted = url.split("/")
        let fileName = splitted[splitted.length - 1]
        const { data, headers } = await Axios({ url, method: 'GET', responseType: 'stream' })
        const totalLength = headers['content-length']
        const writer = fs.createWriteStream(Path.resolve(__dirname, outputDir, fileName))
        console.log(chalk.whiteBright(`${fileName} downloading...`))
        data.pipe(writer)
        data.on('end', () => {
            resolve(true);
        })
    })
}
mods = fs.readFileSync('mods.txt').toString().split("\n")

getMods().then(async () => {
})
