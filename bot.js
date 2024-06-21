console.log("Bot Loading... \n")
const fs = require('node:fs');
const { Client, Events, GatewayIntentBits, REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const { Console } = require('node:console');

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds]});
client.once("ready", () => {
    console.log("Bot logged-in! \n")
})
client.login(process.env.TOKEN);



client.commands = new Map();
const commandsFolder = fs.readdirSync("commands");
commandsFolder.forEach(async file => {
    if(file.endsWith(".js")){
        let command = require(`./commands/${file}`)
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`${command.data.name} successfully loaded;`)
		}else{
            console.warn(`${command.data.name} missing either data or execute property`);
        }
    }
})



client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	try {
		await interaction.client.commands.get(interaction.commandName).execute(interaction);
	} catch (error) {
		console.error(error);
	}
});