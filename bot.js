//externals
import fs from 'fs'
import { Client } from 'discord.js';
import {MC_SERVER_SETTINGS , BOT_SETTINGS} from './settings.js';
import TOKEN from './auth.js';

// startup commands 
let COMMANDS_LIST = [];
fs.readdirSync("commands").forEach(async function(file) {
    let a = await import ("./commands/" + file);
    COMMANDS_LIST.push(a.default);
    console.log("LOADED: " + a.default.name)
}) 

const client = new Client();
const prefix = BOT_SETTINGS.prefix;
client.once('ready', () => {
    console.log("bot online")
})

client.on('message',message =>{
    if(!message.content.startsWith(prefix)) return; //if message doesn't begin with the prefix, stop.
    let args = message.content.slice(prefix.length).split(/ +/); //returns array with all words in the command. Ex: ["help","how","to","do","this"]
    const inputCommand = args.shift().toLowerCase(); //returns only the first word in the command. Ex: "help"

    //start of commands
    COMMANDS_LIST.forEach(current => {
        if(inputCommand === current.name){
            current.command(message,args)
        }else if(current.aliases){
            current.aliases.forEach(alias => {
                if(inputCommand === alias){
                    current.command(message,args)
                }
            });
        }else{ //invalid input
            message.channel.send("Invalid command. Do -help for a list of commands.")
        };
    });
});

client.login(TOKEN)