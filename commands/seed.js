const { SlashCommandBuilder } = require('discord.js');
const guildProfileSchema = require('../models/guildProfileSchema')


module.exports = {
	data: new SlashCommandBuilder()
	.setName('seed')
	.setDescription("Returns the world Seed for this discord server's linked minecraft server."),
	async execute(interaction) {
		await interaction.deferReply();

		//get seed from guild settings on mongodb
		let guildData;
		try {
			guildData = await guildProfileSchema.findOne({guildID: interaction.guildID})
			if(!guildData){
				interaction.editReply("```This bot has not yet been configured on this discord server. Ask an admin to do so with /configure-server-settings```");
				return;
			}else if(!guildData.Seed){
                interaction.editReply("```The admins of this discord server have not provided a seed for the minecraft server.```");
            }else{
                interaction.editReply("Server Seed: ```" + guildData.Seed.toString() + "```");
            }
		} catch (err) {
			console.log(err);
		}
	} 
}       