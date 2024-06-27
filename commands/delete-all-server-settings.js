const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const guildProfileSchema = require('../models/guildProfileSchema')
const commandConfirmation = require('discord-js-easy-confirmations')


module.exports = {
	data: new SlashCommandBuilder()
	.setName('delete-all-server-settings')
	.setDescription("Completely deletes the database entry related to this discord server. Irreversible!")
	.setDefaultMemberPermissions(0), //Administrator only
	async execute(interaction) {
		await interaction.deferReply({ephemeral: true})
		let guildData;
		try {
			guildData = await guildProfileSchema.findOne({guildId: interaction.guildId})
		} catch (err) {
			console.log(err);
		}
		
		let embed = new EmbedBuilder();
		embed.setColor('#FF0000');
		embed.setTitle("Confirm deletion of all bot settings?");
		embed.setDescription("This action is irreversible.");
		await interaction.editReply({embeds: [embed]}); 
		
		commandConfirmation(interaction).then(async res => {
			let resultEmbed = new EmbedBuilder();
			if (res === 'confirmed') {
				await guildProfileSchema.findOneAndDelete({guildId: interaction.guildId});	
				resultEmbed.setColor("#78F72F")
				resultEmbed.setTitle("Deletion Successful!")
				resultEmbed.setDescription("All server settings have been deleted.")
			} else if (res === 'cancelled') {
				resultEmbed.setColor("#FF0000");
				resultEmbed.setTitle("Operation canceled. No changes were made.")
			} else if (res === 'timeout') {
				resultEmbed.setColor("#FF0000");
				resultEmbed.setTitle("Confirmation not recieved within 1 minute. No changes were made.");
			}
			resultEmbed.setTimestamp();
			await interaction.editReply({ embeds: [resultEmbed]});
		})
	} 
}       