const fs = require('fs')
const curseforge = require("mc-curseforge-api");
const moment = require('moment')
const cliProgress = require('cli-progress');
const chalk = require('chalk')
const log = console.log;
const Axios = require('axios')
const Path = require('path')

let mods = []
let modFiles = []

async function getLatestFile(modId, version) {
    let files = await curseforge.getModFiles(modId)
    files = files.filter((f) => f.minecraft_versions.includes(version))
    files.sort((f1, f2) => new Date(f2.timestamp) - new Date(f1.timestamp))
    let latestFile = files[0]
    return latestFile
}

async function getModDependencies(latestFile, version, deps = []) {
    if (latestFile.mod_dependencies.filter((type) => type === 3).length > 0) {
        let mustHaveDependencies = latestFile.mod_dependencies.filter((type) => type === 3)
        for (let dep of mustHaveDependencies) {
            if (!mods.includes(dep.addonId.toString() + "|" + version)) {
                deps.push(dep.addonId.toString() + "|" + version)
                modFiles.push(await getLatestFile(dep.addonId, version));
            }
            await getModDependencies(dep.addonId, version, deps)
        }
    }
    return deps
}

async function getMods() {
    log(chalk.green('[+] Getting mods file and dependencies').bold)
    const dependencyBar = new cliProgress.SingleBar({}, cliProgress.Presets.legacy);
    let deps = []
    dependencyBar.start(mods.length, 0)
    for (let modName of mods) {
        let modId = modName.split("|")[0]
        let version = modName.split("|")[1]
        let latestFile = await getLatestFile(modId, version)
        if(!latestFile) {
            let info = await curseforge.getMod(modId);
            console.log(`${info.name} bulunamadı`)
            dependencyBar.increment()
            continue
        }
        modFiles.push(latestFile)
        deps = deps.concat(await getModDependencies(latestFile, version, []))
        dependencyBar.increment()
    }
    dependencyBar.stop()
    mods = mods.concat(deps)
}
function downloadMod(outputDir, url, multibar) {
    return new Promise(async (resolve) => {
        let splitted = url.split("/")
        let fileName = splitted[splitted.length - 1]
        const { data, headers } = await Axios({ url, method: 'GET', responseType: 'stream' })
        const totalLength = headers['content-length']
        const bar = multibar.create(totalLength, 0);
        const writer = fs.createWriteStream(Path.resolve(__dirname, outputDir, fileName))
        data.on('data', (chunk) => {
            if(bar){
                bar.increment(chunk.length, { filename: fileName })
            }
        })
        data.pipe(writer)
        data.on('end', () => {
            if(bar) {
                bar.stop()
            }
            resolve(true);
        })
    })
}
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

async function downloadMods() {
    var i, j, temparray, chunk = 5;
    for (i = 0, j = modFiles.length; i < j; i += chunk) {
        temparray = modFiles.slice(i, i + chunk);
        const multibar = new cliProgress.MultiBar({
            clearOnComplete: true,
            format: 'Downloading |' + chalk.cyan('{bar}') + '| {percentage}% || {value}/{total} Chunks || {filename}',
        }, cliProgress.Presets.shades_grey);
        let calls = []
        for (let i = 0; i < temparray.length; i++) {
            let modFile = temparray[i]
            calls.push(downloadMod('mods', modFile.download_url, multibar))
        }
        await Promise.all(calls);
        multibar.stop()
        // do whatever
    }
}
mods = fs.readFileSync('mods.txt').toString().split("\n")

getMods().then(async () => {
    await downloadMods();
})
