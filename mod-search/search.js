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
    // const dependencyBar = new cliProgress.SingleBar({}, cliProgress.Presets.legacy);
    let deps = []
    // dependencyBar.start(mods.length, 0)
    for (let modName of mods) {
        let modId = modName.split("|")[0]
        let version = modName.split("|")[1]
        let latestFile = await getLatestFile(modId, version)
        if(!latestFile) {
            let info = await curseforge.getMod(modId);
            console.log(`${info.name} bulunamadı`)
            // dependencyBar.increment()
            continue
        }
        modFiles.push(latestFile)
        // dependencyBar.increment()
    }
    // dependencyBar.stop()
    mods = mods.concat(deps)
}
function downloadMod(outputDir, url) {
    return new Promise(async (resolve) => {
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

async function downloadMods() {
    var i, j, temparray, chunk = 5;
    for (i = 0, j = modFiles.length; i < j; i += chunk) {
        temparray = modFiles.slice(i, i + chunk);
        
        let calls = []
        for (let i = 0; i < temparray.length; i++) {
            let modFile = temparray[i]
            calls.push(downloadMod('mods', modFile.download_url))
        }
        await Promise.all(calls);
        // do whatever
    }
}
mods = fs.readFileSync('mods.txt').toString().split("\n")

getMods().then(async () => {
    await downloadMods();
})
