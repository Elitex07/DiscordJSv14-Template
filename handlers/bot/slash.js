let slash = [];
let a = 0;
let c = 0;
let e = 0;
const { readdirSync } = require("fs");
const { ApplicationCommandType } = require('discord.js');
require('colors');

module.exports = (client) => {
    console.log(`=-=-=-=-=-=-=-=-= WELCOME TO ADVANCED SLASH COMMAND HANDLER =-=-=-=-=-=-=-=-=`.green)
    readdirSync(`./SlashCommands/`).forEach(dir => {
        const commands = readdirSync(`./SlashCommands/${dir}/`).filter(file => file.endsWith(".js"));
        for (let file of commands) {
            let pull = require(`../../SlashCommands/${dir}/${file}`);
            if (pull.name) {
                if ([ApplicationCommandType.Message, ApplicationCommandType.User].includes(pull.type)){
                    client.context.set(pull.name, pull)
                    a++
                } else {
                    client.slashCommands.set(pull.name, pull);
                    c++
                }
                slash.push(pull);
            } else {
                e++;
                continue;
            }
            
            
        }
    });
    console.log(`[Slash Command Handler] ${c} Commands Loaded Successfully.`.yellow);
    console.log(`[Slash Command Handler] ${a} Menu Commands Loaded Successfully`.yellow)
    if(e>0) console.log(`[Slash Command Handler] ${e} Command(s) are not Loaded`.red);
    client.on("ready",async ()=> {
        client.guilds.cache.get('guild-id')?.commands.set(slash)
        await client.application.commands.set(slash)
    });
};
