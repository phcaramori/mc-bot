console.log("Bot Loading... \n")
const fs = require('node:fs');
const { Client, Events, GatewayIntentBits, } = require('discord.js');
const dotenv = require('dotenv');
const connectToMongoDB = require('./connectToMongoDB.js');
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds]});
client.once("ready", () => {
    console.log("---✔ MC Server Helper Bot logged-in to Discord!--- \n")
})
client.login(process.env.TOKEN);

(async ()=>{
    client.commands = new Map();
    const commandsFolder = fs.readdirSync("commands");
    const commandsArray = commandsFolder.filter(file => file.endsWith(".js"));
    console.log(`LOADING ${commandsArray.length} COMMANDS:`)
    let count = 0, errcount = 0;
    commandsArray.forEach(async file => {
        count ++;
        let command = require(`./commands/${file}`)
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`[${count}]: | ${command.data.name} | --> successfully loaded`)
        }else{
            errcount ++;
            console.warn(`[${count}]: | ${command.data.name} | --> failed to load: missing either data or execute property`);
        }
    })
    if(!errcount){
        console.log(`---✔ SUCCESSFULLY LOADED ALL ${commandsArray.length} COMMANDS--- \n \n`)
    }else{
        console.warn(`---FAILED TO LOAD ${errcount} COMMANDS (out of ${commandsArray.length} total)--- \n \n`)
    }
    connectToMongoDB() //only connect to db after loading all commands 
})();


client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	try {
		await interaction.client.commands.get(interaction.commandName).execute(interaction);
	} catch (error) {
		console.error(error);
	}
});