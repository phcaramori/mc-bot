const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const guildProfileSchema = require('../models/guildProfileSchema')
const commandConfirmation = require('discord-js-easy-confirmations')


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
		await interaction.editReply({embeds: [embed]});

		//confirmation
		commandConfirmation(interaction).then(async res => {
			let resultEmbed = new EmbedBuilder();
			if(res == "confirmed"){
				try {
					if(!guildData){ //if the db doesnt yet have information on this guild's settings
						console.log("Creating new DB entry for guild " + interaction.guildId);
						guildData = await guildProfileSchema.create({
							guildId: interaction.guildId,
							IP: newServerIP,
							Seed: newServerSeed, //if no seed was given in the command, newServerSeed is already set to null.
						})
					}else{
						await guildProfileSchema.findOneAndUpdate( {guildId: interaction.guildId} , {$set: { IP: newServerIP, Seed: newServerSeed } } )
					}
					resultEmbed.setColor("#78F72F")
					resultEmbed.setTitle("Saving Successful! The following changes were made:")
					resultEmbed.addFields({name:"Server IP:", value: newServerIP, inline:true})
					resultEmbed.addFields({name:"Server Seed:", value: newServerSeedStr, inline:true})
				} catch (err) {
					console.log(err);	
				}
			}else if(res == "canceled"){
				resultEmbed.setColor("#FF0000");
				resultEmbed.setTitle("Operation canceled. No changes were made.")
			}else if(res == "timeout"){
				resultEmbed.setColor("#FF0000");
				resultEmbed.setTitle("Confirmation not recieved within 1 minute. No changes were made.");
				resultEmbed.setTimestamp();
			}
			await interaction.editReply({ embeds: [resultEmbed]});
		})
	}
}       