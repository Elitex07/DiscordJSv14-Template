const client = require('../../index');
const { EmbedBuilder, Collection, PermissionsBitField } = require(`discord.js`);

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

    cmd.execute(client, interaction, args);
});
