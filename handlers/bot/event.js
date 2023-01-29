const {readdirSync} = require('fs');
const e = 0;
module.exports = (client) => {
    console.log(`=-=-=-=-=-=-=-=-= WELCOME TO ADVANCED EVENTS HANDLER =-=-=-=-=-=-=-=-=`.green)
    readdirSync("./Events/").forEach(dir => {
        const events = readdirSync(`./Events/${dir}/`).filter(file => file.endsWith(".js"))
        for(let file of events) {
            let pull = require(`../../Events/${dir}/${file}`);
            if(pull.name){
                client.events++;
                e++
            } else {
                client.events++
                continue;
            }
        }
    })
    console.log(`[Event Handler] ${a} Events Loaded Successfully`.yellow);
    if(e>0) console.log(`[Event Handler] ${e} Event(s) are not Loaded`.red);
}
