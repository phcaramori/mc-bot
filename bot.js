//externals
import fs from 'fs'
import { Client } from 'discord.js';
import {MC_SERVER_SETTINGS , BOT_SETTINGS} from './settings.js';
import TOKEN from './auth.js';

//startup commands 
// fs.readdirSync("commands").forEach(function(file) {
//     let fileName = file.substring(0,file.length - 3)
//     import ("./commands/" + file);
// });

import online from './commands/online.js';
import help from './commands/help.js';
import owo from './commands/owo.js';
import uwu from './commands/uwu.js';

const COMMANDS = [online,help,owo,uwu]

const client = new Client();
const prefix = BOT_SETTINGS.prefix;
client.once('ready', () => {
    console.log("bot online")
})

client.on('message',message =>{
    console.log('message recieved');
    if(!message.content.startsWith(prefix)) return; //if message doesn't begin with the prefix, stop.

    const args = message.content.slice(prefix.length).split(/ +/); //returns array with all words in the command. Ex: ["help","how","to","do","this"]
    const inputCommand = args.shift().toLowerCase(); //returns only the first word in the command. Ex: "help"

    //start of commands
    for(let i = 0; i < COMMANDS.length; i++){
        if(inputCommand == COMMANDS[i].name){
            COMMANDS[i].command(message)
        }else if(COMMANDS[i].aliases){
            for(let j = 0; j < COMMANDS[i].aliases.length; j++){
                if(inputCommand == COMMANDS[i].aliases){
                    COMMANDS[i].command(message)
                }
            }
        }else{ //invalid input
            message.channel.send("Invalid command. Do -help for a list of commands.")
        }
    }
    switch (inputCommand) {
        case "ip":
            message.channel.send("```" + MC_SERVER_SETTINGS.ip + "```")
            break;

        case "seed":
            message.channel.send("```" + MC_SERVER_SETTINGS.seed + "```")
            break;

        case "ping":
            message.channel.send("pong")
            break;

    }
})
client.login(TOKEN)