const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const dotenv = require('dotenv');
dotenv.config();

let commandsData = [];
const commandsFolder = fs.readdirSync("commands");
commandsFolder.forEach(async file => {
    if(file.endsWith(".js")){
        let command = require(`./commands/${file}`)
        if ('data' in command && 'execute' in command) {
            commandsData.push(command.data.toJSON());
		}else{
            console.warn(`${command.data.name} missing either data or execute property`);
        }
    }
})

const rest = new REST().setToken(process.env.TOKEN);
(async () => {
	try {
        console.log(`Started refreshing ${commandsData.length} application (/) commands.`);
		const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENTID), 
            { body: commandsData },
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})(); //<--- creates and immediately calls unnamed function
