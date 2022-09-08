const { EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'ping',
    description: 'Ping of the bot',
    aliases: ['latency'],
    cooldown: '10',
    run: async(client, message, args) => {
        message.reply({embeds:[new EmbedBuilder()
            .setTitle(`:stopwatch: WS Ping : \`${client.ws.ping} MS\`

:hourglass: Latency : \`${Date.now() - message.createdTimestamp - 50} MS\`

:gear: Uptime : ${ms(client.uptime)}`)
            .setColor(3092790)], content: `**:ping_pong: Pong!**`})
    }
}