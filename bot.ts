/* TODO:
* - FIX EMBED SYNTAX ON HELP
* - MAKE HELP WORK AUTOMATICALLY
* - IMPLEMENT INTERACTIONS
* - MAKE SIMPLE, REACTION-BASED GAME
*/

console.log('loading...')
//externals
import fs from 'fs'
import DiscordJS, { Client , GatewayIntentBits , SlashCommandBuilder  } from 'discord.js';
import {MC_SERVER_SETTINGS , BOT_SETTINGS} from './settings';
import dotenv from 'dotenv';
dotenv.config()

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

// startup commands 
const prefix = "-";
let commandsManager;
let COMMANDS_LIST = new Map();
client.on('ready', () => {
    console.log("bot online")

    const guild_ID = "1009690142748975114"
    const guild = client.guilds.cache.get(guild_ID)
    commandsManager = guild.commands;

    //load in all commands
    fs.readdirSync("commands").forEach(async function(file) {
        let command = await import ("./commands/" + file);
        console.log("LOADED: " + command.default.data.name);
        
        COMMANDS_LIST.set(command.default.data.name, command.default.command);
        commandsManager?.create(command.default.data);
    }) 
})

//Client Interaction
client.on('interactionCreate',async interaction => {
    if(interaction.isCommand()){
        const { commandName } = interaction;
        let selectedCommand = COMMANDS_LIST.get(commandName)
        console.log("User inputted: " + commandName)
        selectedCommand(interaction)
    }
    if(interaction.isButton()){
        let selectedCommand = COMMANDS_LIST.get(interaction.message.interaction.commandName)
        selectedCommand(interaction)
    }
})

//LEGACY COMMAND client interaction using message.content
// client.on('messageCreate', (message) =>{
//     if(!message.content.startsWith(prefix)) return; //if message doesn't begin with the prefix, stop.
//     let args = message.content.slice(prefix.length).split(/ +/); //returns array with all words in the command. Ex: ["help","how","to","do","this"]
//     const inputCommand = args.shift().toLowerCase(); //returns only the first word in the command. Ex: "help"
//     console.log(inputCommand)
//     //start of commands
//     COMMANDS_LIST.forEach( current => {
//         if(inputCommand === current.name){
//             current.command(message,args)
//         }else if(current.aliases){
//             current.aliases.forEach(alias => {
//                 if(inputCommand === alias){
//                     current.command(message,args)
//                 }
//             });
//         }else{ //invalid input
//             message.channel.send("Invalid command. Do -help for a list of commands.")
//         };
//     });
// });

client.login(process.env.TOKEN)