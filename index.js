const {Client, Collection, GatewayIntentBits, Partials, EmbedBuilder} = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const OS = require('os');
const Events = require('events');
const express = require('express');
require('colors');
const app = express();
const port = 2323;

// Initialzing Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User
    ],
    presence: {
        activities: [{name: `raiden.help | v4.4`, type: 0}],
        status: "idle"
    }
});

// Website Management
const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'Website')))
app.use(express.static(`${__dirname}/Website`))

app.get('/home', (req, res) => {
    res.sendFile('./Website/home.html', {root: __dirname});
});

app.get('/', (req, res)=>{
    res.redirect('/home')
})

app.get('/invite', (req, res)=>{
    res.sendFile('./Website/invite.html', {root: __dirname});
});

app.get('/support', (req, res)=>{
    res.sendFile('./Website/support.html', {root: __dirname});
});


app.listen(port, () => {
    console.log(`Successfully Conencted to Webpage.`)
});

// Increasing Event Listener Size
client.setMaxListeners(0);
Events.defaultMaxListeners = 0;
process.env.UV_THREADPOOL_SIZE = OS.cpus().length;

//CONNECT TO DATABASE
(async () => {
    await require("./Database/connect")();
})();


//exporting client
module.exports = client;

//defining useful collection
client.slashCommands = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./Commands/");
client.context = new Collection();
client.events = new Collection();

//connecting handlers
["command", "event","slash"].forEach(handler => {
    require(`./handlers/bot/${handler}`)(client);
});

// Crash - Prevention
process.on('unhandledRejection', (err, cause) => {
    //client.channels.cache.get('962134370225909830')?.send(`Unhandled Rejection : ${reason}`)
    //console.log(`Unhandled Rejection at:`, promise);
    let errorembeed = new EmbedBuilder()
    .setTitle(`<:PepeWhatTheFUCK:962736329408512050> Error Caught!`)
    .setDescription(`\`\`\`js\n${err}\`\`\``)
    .setColor('Random')
    client.fetchWebhook('999537836917280878','_M1i_8iPKEKuGLw4E2900WIal3tfZQTm6JB_4MZhBA9ensbGhtKa1JA3IVgdSsTbGkaZ')
    .then(a => a.send({embeds: [errorembeed]}));

    console.log(`[Uncaught Exception]: ${err}`.bold.brightGreen);
    console.log(cause);
});

process.on('uncaughtException', err => {
    //client.channels.cache.get('962134370225909830')?.send(`Unhandled Rejection : ${reason}`)
    //console.log(`Unhandled Rejection at:`, promise);
    let errorembeed = new EmbedBuilder()
    .setTitle(`<:PepeWhatTheFUCK:962736329408512050> Exception Caught!`)
    .setDescription(`\`\`\`js\n${err}\`\`\``)
    .setColor('Random')
    client.fetchWebhook('999537836917280878','_M1i_8iPKEKuGLw4E2900WIal3tfZQTm6JB_4MZhBA9ensbGhtKa1JA3IVgdSsTbGkaZ')
    .then(a => a.send({embeds:[errorembeed]}));

    console.log(`[Uncaught Exception] ${err.message}`.bold.brightGreen)
});

// Logging in Discord
client.login(process.env.token)