import  { EmbedBuilder } from 'discord.js';

export default {
    name: "help",
    aliases: ["h"],
    description: "Generates this message. Hi!",
    command: function (message) {
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
        message.channel.send(embed);
    }
}