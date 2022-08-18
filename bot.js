//externals
import { Client } from 'discord.js';
import SERVER_SETTINGS from './settings.js';
import TOKEN from './auth.js';

//commands - MAKE LOOP
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

    //start of commands
    switch (command) {
        case "help":
            help.command(message)
            break;

        case "online":
            online(message)
            break;
            
        case "owo":
            owo(message)
            break;

        case "uwu":
            uwu(message)
            break;

        case "ip":
            message.channel.send("```" + SERVER_SETTINGS.ip + "```")
            break;

        case "seed":
            message.channel.send("```" + SERVER_SETTINGS.seed + "```")
            break;

        case "ping":
            message.channel.send("pong")
            break;
        
        //invalid input
        default:
            message.channel.send("Invalid command. Do -help for a list of commands.")
            break;
    }
})
client.login(TOKEN)