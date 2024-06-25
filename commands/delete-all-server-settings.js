const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const guildProfileSchema = require('../models/guildProfileSchema')


module.exports = {
	data: new SlashCommandBuilder()
	.setName('delete-all-server-settings')
	.setDescription("Completely deletes the database entry related to this discord server. Irreversible!")
	.setDefaultMemberPermissions(0), //Administrator only
	async execute(interaction) {
		await interaction.deferReply({ephemeral: true})
		let guildData;
		try {
			guildData = await guildProfileSchema.findOne({guildID: interaction.guildID})
		} catch (err) {
			console.log(err);
		}
		
		const confirm = new ButtonBuilder()
			.setCustomId('confirmDeleteGuildData')
			.setLabel('Confirm Delete Data')
			.setStyle(ButtonStyle.Danger);
		const cancel = new ButtonBuilder()
			.setCustomId('cancelDeleteGuildData')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);
		const row = new ActionRowBuilder()
			.addComponents(confirm, cancel);

		let embed = new EmbedBuilder();
		embed.setColor('#FF0000');
		embed.setTitle("Confirm deletion of all bot settings?");
		embed.setDescription("This action is irreversible.");
		const confirmationMsg = await interaction.editReply({embeds: [embed], components: [row]}); 

		const collectorFilter = i => i.user.id === interaction.user.id; //make sure the incoming interaction cames from the same user who started the slash command
		let resultEmbed = new EmbedBuilder();
		try {
			const confirmation = await confirmationMsg.awaitMessageComponent({ filter: collectorFilter, time: 60_000 }); //await response TODO TEST

			if (confirmation.customId === 'confirmDeleteGuildData') {
				await guildProfileSchema.findOneAndDelete({guildID: interaction.guildID});	
				console.log()
				resultEmbed.setColor("#78F72F")
				resultEmbed.setTitle("Deletion Successful!")
				resultEmbed.setDescription("All server settings have been deleted.")
			} else if (confirmation.customId === 'cancelDeleteGuildData') {
				resultEmbed.setColor("#FF0000");
				resultEmbed.setTitle("Operation canceled. No changes were made.")
			}
			await confirmation.update({ embeds: [resultEmbed], components: [] });
		} catch (e) {
			if(e.code=="InteractionCollectorError"){ //probably a timeout? no specific error code for timeout, might have to change if Ifind that this code can occur with other errors.
				resultEmbed.setColor("#FF0000");
				resultEmbed.setTitle("Confirmation not recieved within 1 minute. No changes were made.");
				resultEmbed.setTimestamp();
				await interaction.editReply({ embeds: [resultEmbed], components: [] });
			}else{
				console.log(e);
				resultEmbed.setColor("#FF0000");
				resultEmbed.setTitle("Internal bot error occured. Please contact the developer and give the timestamp below");
				resultEmbed.setTimestamp();
				await interaction.editReply({ embeds: [resultEmbed], components: [] });
			}
		}
	} 
}       