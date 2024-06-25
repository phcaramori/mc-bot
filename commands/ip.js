const { SlashCommandBuilder } = require('discord.js');
const guildProfileSchema = require('../models/guildProfileSchema')


module.exports = {
	data: new SlashCommandBuilder()
	.setName('ip')
	.setDescription("Returns the IP for this discord server's linked minecraft server."),
	async execute(interaction) {
		await interaction.deferReply();

		//get seed from guild settings on mongodb
		let guildData;
		try {
			guildData = await guildProfileSchema.findOne({guildId: interaction.guildId})
			if(!guildData){
				interaction.editReply("```This bot has not yet been configured on this discord server. Ask an admin to do so with /configure-server-settings```");
				return;
			}else{
                interaction.editReply("Server IP Adress: ```" + guildData.IP + "```");
            }
		} catch (err) {
			console.log(err);
		}
	} 
}       