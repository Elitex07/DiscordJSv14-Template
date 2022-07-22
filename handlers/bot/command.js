const {readdirSync} = require('fs');
const colors = require('colors');
let a = 0;
let e = 0;

module.exports = (client) => {
    console.log(`=-=-=-=-=-=-=-=-= WELCOME TO ADVANCED MESSAGE COMMAND HANDLER =-=-=-=-=-=-=-=-=`.green)
    readdirSync('./Commands/').forEach(dir => {
        const commands = readdirSync(`./Commands/${dir}/`).filter(file => file.endsWith('.js'));
        for(let file of commands){
            let pull = require(`../../Commands/${dir}/${file}`);
            if(pull.name){
                client.commands.set(pull.name, pull);
                a++
            } else {
                e++
                continue;
            }
            if(pull.aliases && Array.isArray(pull.aliases))
            pull.aliases.forEach(alias => client.aliases.set(alias, pull.name))
        }
    });
    console.log(`[Message Command Handler] ${a} Commands Loaded Successfully.`.yellow);
    if(e>0) console.log(`[Message Command Handler] ${e} Command(s) are not Loaded`.red);
}
