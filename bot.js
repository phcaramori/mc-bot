//externals
import { Client } from 'discord.js';
import SERVER_SETTINGS from './settings.js';
import TOKEN from './auth.js';

//commands
import online from './commands/online.js';
import help from './commands/help.js';
import { owo, uwu } from './commands/text-modulation.js';

//startup
const client = new Client();
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

    if(command == "help"){ help(message) }
    else if(command == "online") { online(message) }
    else if(command == "owo") { owo(message) }
    else if(command == "uwu") { uwu(message) } 
    else if(command == "ip"){ message.channel.send("```" + SERVER_SETTINGS.ip + "```") }
    else if(command == "seed") { message.channel.send("```" + SERVER_SETTINGS.seed + "```") }
    else if(command == "ping") { message.channel.send("pong") }

    //invalid input

    else{ 
        message.channel.send("Invalid command. Do -help for a list of commands.")
}
})
client.login(TOKEN)