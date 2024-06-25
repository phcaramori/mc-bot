const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');
const guildProfileSchema = require('../models/guildProfileSchema')


module.exports = {
	data: new SlashCommandBuilder()
	.setName('online')
	.setDescription('Checks who is online on the server'),
	async execute(interaction) {
		const embed = new EmbedBuilder();
		let finalMessage = '', embedTitle, playersOnline;
		await interaction.deferReply();

		//get ip from guild settings
		let guildData;
		try {
			guildData = await guildProfileSchema.findOne({guildId: interaction.guildId})
			if(!guildData){
				interaction.editReply("```This discord server has not yet been linked to a minecraft server IP. Ask an admin to do so with /configure-server-settings```");
				return;
			}
		} catch (err) {
			console.log(err);
		}

		const res = await request(`https://api.mcsrvstat.us/3/${guildData.IP}`);
		let data = "";
		for await (const chunk of res.body) {
			data += chunk;
		}
		const jsonData = JSON.parse(data);

		prevTime = new Date(jsonData.debug.cachetime * 1000)
		if(!jsonData.online){ //server offline
			embed.setTitle("The server is currently offline.");
			embed.setColor('#ff0000');
		}else{
			playersOnline = jsonData.players.list;
			if (playersOnline) { 
				playersOnline.forEach(e => {
					finalMessage = finalMessage + '\n' + e.name;
				});
				embedTitle = (playersOnline.length == 1) ? 'There is 1 player currently online.' : `There are ${playersOnline.length} players currently online.`;
				embed.setTitle(embedTitle);
				embed.addFields({name: 'List of players:', value: finalMessage});
				embed.setColor('#78F72F');
			}else{    
				embed.setTitle('The server is currently empty.');
				embed.setColor('#f7ae2f');
			}
		}
	prevTimeString = prevTime.toUTCString();
	embed.setFooter({text: `Last updated: ${prevTimeString} • Updates every minute`});
	interaction.editReply({ embeds: [embed], ephemeral: false});
	} 
}       