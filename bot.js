//externals
const Discord = require('discord.js');
const SERVER_SETTINGS = require('./settings.js');
const TOKEN = require('./auth.js');
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

    if(command == "help"){ help.help(message) }
    else if(command == "online") { online.online(message) }
    else if(command == "owo") { text.owo(message) }
    else if(command == "uwu") { text.uwu(message) } 
    else if(command == "ip"){ message.channel.send("Server IP: ``" + SERVER_SETTINGS.ip + "``") }
    else if(command == "seed") { message.channel.send("```" + SERVER_SETTINGS.seed + "```") }
    else if(command == "ping") { message.channel.send("ping") }

    //invalid input

    else{ 
        message.channel.send("Invalid command. Do -help for a list of commands.")
}
})
client.login(TOKEN)