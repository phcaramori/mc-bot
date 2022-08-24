import  { EmbedBuilder , SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Generates this message. Hi!")
        
        ,
    command: function (interaction) {
        const embed = new EmbedBuilder();
        embed.setTitle("Help");
        //embed.addField("-shophelp", "Used for help with setting up shops");
        embed.addFields(
            {name : "-seed", value: "Used to find the world's seed"},
            {name : "-ip", value: "Used to find the server's ip"},
            {name : "-online", value: "Used to get a list of what players are currently on the server"},
        );
        //embed.addField("-set", "Used to set properties for the bot. Usage: ```-set [seed/ip] (value)```");
        embed.setColor('#7f7f7f');
        interaction.reply({embeds: embed});
    }
}