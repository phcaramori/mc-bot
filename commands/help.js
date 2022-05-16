function help(message) {
    const Discord = require('discord.js');
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Help");
    //embed.addField("-shophelp", "Used for help with setting up shops");
    embed.addField("-seed", "Used to find the world's seed");
    embed.addField("-ip", "Used to find the server's ip");
    embed.addField("-online", "Used to get a list of what players are currently on the server");
    //embed.addField("-set", "Used to set properties for the bot. Usage: ```-set [seed/ip] (value)```");
    embed.setColor('#7f7f7f');
    message.channel.send(embed);
}

module.exports.help = help;
