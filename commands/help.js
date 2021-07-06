function help(message) {
    const Discord = require('discord.js');
    const embed = new Discord.MessageEmbed();
    embed.setTitle("Help");
    embed.addField("-shophelp", "Used for help with setting up shops");
    embed.addField("-seed", "Used to find the world's seed");
    embed.addField("-ip", "Used to find the server's ip");
    embed.addField("-online", "Used to get a list of what players are currently on the server");
    embed.setColor('#7f7f7f');
    message.channel.send(embed);
    //end of -help
}
function shophelp(message) {
    message.channel.send("Use this link for help with setting up a shop: https://github.com/Shopkeepers/Shopkeepers-Wiki/wiki/Player-Shop-Setup. \n \n If you have any questions, feel free to dm Walnut_.");
}

module.exports.help = help;
module.exports.shophelp = shophelp;