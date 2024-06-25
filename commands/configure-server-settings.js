const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const guildProfileSchema = require('../models/guildProfileSchema')


module.exports = {
	data: new SlashCommandBuilder()
	.setName('configure-server-settings')
	.setDescription("Sets or changes the Minecraft server properties linked to this discord server. (IP, seed, etc.)")
	.setDefaultMemberPermissions(0) //Administrator only
	.addStringOption(option =>
		option.setName('ip-adress')
			.setDescription("The server's IP adress, including the port (if needed); exactly as you type it into minecraft.")
			.setRequired(true))
	.addIntegerOption(option =>
		option.setName('seed')
			.setDescription("The server's seed. Leave empty if the seed is not supposed to be acessible to players.")),
	async execute(interaction) {
		await interaction.deferReply({ephemeral: true})
		let guildData;
		try {
			guildData = await guildProfileSchema.findOne({guildId: interaction.guildId})
		} catch (err) {
			console.log(err);
		}

		const newServerIP = interaction.options.getString('ip-adress');
		const newServerSeed = interaction.options.getInteger('seed') ?? null;
		const newServerSeedStr = (newServerSeed) ? newServerSeed.toString() : "No Seed Set.";
		let embed = new EmbedBuilder();
		embed.setColor('#0080FF')
		embed.setTitle("Confirm changes to bot settings?")
		let storedServerIP = (guildData && guildData.IP) ? guildData.IP : "no IP set" ;
		let storedServerSeed = (guildData && guildData.Seed) ? guildData.Seed : "no seed set" ;
		embed.addFields({name:"Server IP:", value: `**FROM:** ${storedServerIP} **TO:** ${newServerIP}`})
		embed.addFields({name:"Server Seed:", value: `**FROM:** ${storedServerSeed.toString()} **TO:** ${newServerSeedStr}`})
		
		const confirm = new ButtonBuilder()
			.setCustomId('confirmNewServerSettings')
			.setLabel('Confirm')
			.setStyle(ButtonStyle.Success);
		const cancel = new ButtonBuilder()
			.setCustomId('cancelNewServerSettings')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Danger);
		const row = new ActionRowBuilder()
			.addComponents(confirm, cancel);
		const confirmationMsg = await interaction.editReply({embeds: [embed], components: [row]}); 

		const collectorFilter = i => i.user.id === interaction.user.id; //make sure the incoming interaction cames from the same user who started the slash command
		let resultEmbed = new EmbedBuilder();
		try {
			const confirmation = await confirmationMsg.awaitMessageComponent({ filter: collectorFilter, time: 60_000 }); //await response TODO TEST

			if (confirmation.customId === 'confirmNewServerSettings') {
				if(!guildData){ //if the db doesnt yet have information on this guild's settings
					console.log("Creating new DB entry for guild " + interaction.guildId);
					guildData = await guildProfileSchema.create({
						guildId: interaction.guildId,
						IP: newServerIP,
						Seed: newServerSeed, //if no seed was given in the command, newServerSeed is already set to null.
					})
				}else{
					console.log("Changin existing DB entry for guild " + interaction.guildId);
					await guildProfileSchema.findOneAndUpdate(
						{guildId: interaction.guildId},
						{
							$set: {
								IP: newServerIP,
								Seed: newServerSeed,
				}})}
				
				resultEmbed.setColor("#78F72F")
				resultEmbed.setTitle("Saving Successful! The following changes were made:")
				resultEmbed.addFields({name:"Server IP:", value: newServerIP, inline:true})
				resultEmbed.addFields({name:"Server Seed:", value: newServerSeedStr, inline:true})

			} else if (confirmation.customId === 'cancelNewServerSettings') {
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