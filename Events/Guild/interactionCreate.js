const client = require('../../index');
const { EmbedBuilder, Collection, PermissionsBitField } = require(`discord.js`);
const cooldowns = new Map();
const ms = require('ms');

client.on('interactionCreate', async interaction => {
    if (interaction.isContextMenuCommand()){
        const command = client.context.get(interaction.commandName);
        if (command) command.execute(client, interaction);
        else{
            interaction.reply({ content: "Deprecated Menu Command" });
            await client.application.commands.delete(cmd);
        }
        return
    }
	if (!interaction.isChatInputCommand()) return;

    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd){
        interaction.reply({ content: "Deprecated Slash Command" });
        await client.application.commands.delete(cmd);
        return;
    } 
    
    const args = [];

    for (let option of interaction.options.data) {
        if (option.type == 1) {
            if (option.name) args.push(option.name);
            option.options?.forEach((x) => {
                if (x.value) args.push(x.value);
            });
        } else if (option.type == 2){
            if(option.name) args.push(option.name);
            option.options?.forEach((x)=>{
                if(x.type == 1){
                    if (x.name) args.push(x.name);
                    x.options?.forEach((i) => {
                        if (i.value) args.push(i.value);
                    });
                }
            })
        } else {
           if(option.value) args.push(option.value);
        }
    }

    if(!interaction.member) interaction.member = await interaction.guild.members.fetch(interaction.user.id);
	
    const command = cmd;
      if(command){
            //registering command in map to get cooldowns
            if(!cooldowns.has(command.name)){
                cooldowns.set(command.name, new Collection());
            }

            const current_time = Date.now();
            const time_stamps = cooldowns.get(command.name);
            const cooldown_amount = (command.cooldown) * 1000;

            //If time_stamps has a key with the author's id then check the expiration time to send a message to a user.
            if(time_stamps.has(interaction.user.id)){
                const expiration_time = time_stamps.get(interaction.user.id) + cooldown_amount;

                if(current_time < expiration_time){
                    const time_left = (expiration_time - current_time);

                    return interaction.reply({embeds: [
                        new EmbedBuilder()
                        .setDescription(`**You are on a cooldown of \`${ms(cooldown_amount)}\`.\n\nCooldown Ends: <t:${((Date.now() + time_left)/1000).toFixed(0)}:R>**`)
                        .setColor(interaction.guild.members.me.displayHexColor)
                    ]});
                }
            }

            //If the author's id is not in time_stamps then add them with the current time.
            time_stamps.set(interaction.user.id, current_time);
            //Delete the user's id once the cooldown is over.
            setTimeout(() => time_stamps.delete(interaction.user.id), cooldown_amount);
        }

    cmd.execute(client, interaction, args);
});
