const {Client, Collection, GatewayIntentBits, Partials, EmbedBuilder} = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const OS = require('os');
const Events = require('events');
require('colors');

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
        activities: [{name: `Raiden Bot`, type: 0}],
        status: "online" //online/idle/dnd
    }
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
    console.log(`[Uncaught Exception]: ${err}`.bold.brightGreen);
});

process.on('uncaughtException', err => {
    console.log(`[Uncaught Exception] ${err.message}`.bold.brightGreen)
});

// Logging in Discord
client.login(process.env.token)
.catch(e => console.log(`[DISCORD API] ${e}`.red))
