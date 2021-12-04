const curseforge = require("mc-curseforge-api");
const yargs = require('yargs/yargs')
const moment = require('moment')
const inquirer = require("inquirer");

var argv = require('yargs/yargs')(process.argv.slice(2)).usage('Usage: $0 --search [string] --mc-version [string]').demandOption(['search', 'mc-version']).argv;

let search = argv.search
let version = argv["mc-version"]

//inquirer
//  .prompt([
//    {
//      type: "list",
//      name: "prize",
//      message: "Select a prize",
//      choices: ["cake", "fries"]
//    }
//  ])
//  .then((answers) => { 
//    console.log(JSON.stringify(answers, null, "  "));
//  });

curseforge.getMods({searchFilter: search, gameVersion: version}).then((mods) => {
    let mod = mods[0]
    if (! mod) {
        console.log("No results found")
        return;
    }
    
    inquirer
    .prompt([
        {
        type: "list",
        name: "mod",
        message: "Curseforge Results:",
        choices: mods.map(m => m.name)
        }
    ])
    .then((answers) => { 
        mod = mods.find(m => m.name == answers.mod);
        console.log(mod.name, "Mod id is",mod.id)
        // curseforge.getModFiles(mod.id).then((files) => {
        //     let versionMatches = files.filter((f) => f.minecraft_versions.includes(version))
        //     let sortedDate = versionMatches.sort((f1, f2) => new Date(f2.timestamp) - new Date(f1.timestamp))
        //     console.log(versionMatches.map((f) => moment(f.timestamp).format('YYYY-MM-DD HH:mm:ss') + " | " + f.download_url).join('\n'))
        // })
    });

    
});
