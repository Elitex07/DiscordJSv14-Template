const {readdirSync} = require('fs');
const colors = require('colors');
let a = 0;
let e = 0;

module.exports = (client) => {
    console.log(`=-=-=-=-=-=-=-=-= WELCOME TO ADVANCED EVENTS HANDLER =-=-=-=-=-=-=-=-=`.green)
    readdirSync("./Events/").forEach(dir => {
        const events = readdirSync(`./Events/${dir}/`).filter(file => file.endsWith(".js"))
        for(let file of events) {
            let pull = require(`../../Events/${dir}/${file}`);
            if(pull.name){
                client.events.set(pull.name, pull);
                e++
            } else {
                a++
                continue;
            }
        }
    })
    console.log(`[Event Handler] ${a} Events Loaded Successfully`.yellow);
    if(e>0) console.log(`[Event Handler] ${e} Event(s) are not Loaded`.red);
}
