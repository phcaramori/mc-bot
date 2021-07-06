//externals
const Discord = require('discord.js');
const owoify = require("owoify-js").default;

//commands
const online = require('./commands/online')
const help = require('./commands/help')
const text = require('./commands/text-modulation')

//startup
const client = new Discord.Client();
const prefix ='-';

client.once('ready', () => {
    console.log("bot online")
})

client.on('message',message =>{
    console.log('message recieved');
    if(!message.content.startsWith(prefix)) return; //if message doesn't begin with the prefix, stop.

    const args = message.content.slice(prefix.length).split(/ +/); //returns array with all words in the command. Ex: ["help","how","to","do","this"]
    const command = args.shift().toLowerCase(); //returns only the first word in the command. Ex: "help"

    console.log(command)

    //start of commands

    if(command == "help"){ help.help() }
    else if(command == "shophelp"){ help.shophelp() }
    else if(command == "online") { online.online() }
    else if(command == "owo") { text.owo() }
    else if(command == "uwu") { text.uwu() } 
    else if(command == "ip"){ message.channel.send("Server IP: ``51.161.84.204:25631``") }
    else if(command == "seed") { message.channel.send("idk the seed. dont think it works with the 1.17 world gen (yet atleast)") }
    else if(command == "ping") { message.channel.send("ping") }

    //invalid input

    else{ 
        message.channel.send("Invalid command. Do -help for a list of commands.")
}
})
client.login('NzQyNzk3MTI1ODQyMTA4NDU3.XzLVuw.jJGbLdDKJ-9wUEsoH7F_o6J5kBM')