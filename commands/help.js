export function help() {
    const embed = new Discord.MessageEmbed();
    embed.addField("Help", ".");
    embed.addField("-shophelp", "Used for help with setting up shops");
    embed.addField("-seed", "Used to find the world's seed");
    embed.addField("-ip", "Used to find the server's ip");
    embed.addField("-online", "Used to get a list of what players are currently on the server");
    embed.setColor('#7f7f7f');
    message.channel.send(embed);
    //end of -help
}
export function shophelp() {
    message.channel.send("Use this link for help with setting up a shop: https://github.com/Shopkeepers/Shopkeepers-Wiki/wiki/Player-Shop-Setup. \n \n If you have any questions, feel free to dm Walnut_.");
}
