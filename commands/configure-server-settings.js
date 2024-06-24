const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
//import server ip here


module.exports = {
	data: new SlashCommandBuilder()
	.setName('configure-server-settings')
	.setDescription('Configures the servers setting for this specific discord server. (IP, seed, etc.)')
	.setDefaultMemberPermissions(0) //Administrator only
	.addStringOption(option =>
		option.setName('ip-adress')
			.setDescription("The server's IP adress")
			.setRequired(true))
	.addIntegerOption(option =>
		option.setName('seed')
			.setDescription("The server's seed. Leave empty if the seed is not supposed to be acessible to players.")),
	async execute(interaction) {
		const serverIP = interaction.options.getString('ip-adress');
		const serverSeed = interaction.options.getInteger('seed') ?? null;
		let embed = new EmbedBuilder();

		embed.setColor('#0080FF')
		embed.setTitle("Confirm changes to bot settings?")
		embed.addFields({name:"Server IP:", value: serverIP, inline:true})
		if(serverSeed){
			console.log(typeof(serverSeed));
			embed.addFields({name:"Server Seed:", value: serverSeed.toString(), inline:true})
		}else{
			embed.addFields({name:"Server Seed:", value: "No seed given", inline:true})
		}

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
		const confirmationMsg = await interaction.reply({embeds: [embed], components: [row], ephemeral: true}); 

		//Confirmaiton
		const collectorFilter = i => i.user.id === interaction.user.id; //make sure the incoming interaction cames from the same user who started the slash command
		let resultEmbed = new EmbedBuilder();
		try {
			const confirmation = await confirmationMsg.awaitMessageComponent({ filter: collectorFilter, time: 60_000 }); //await response

			if (confirmation.customId === 'confirmNewServerSettings') {
				//CHANGE SETTINGS HERE (inside a try-catch)
				
				resultEmbed.setColor("#78F72F")
				resultEmbed.setTitle("Saving Successful! The following changes were made:")
				resultEmbed.addFields({name:"Server IP:", value: serverIP, inline:true})
				if(serverSeed){
					resultEmbed.addFields({name:"Server Seed:", value: serverSeed.toString(), inline:true})
				}else{
					resultEmbed.addFields({name:"Server Seed:", value: "No seed given", inline:true})
				}
			} else if (confirmation.customId === 'cancelNewServerSettings') {
				resultEmbed.setColor("#FF0000");
				resultEmbed.setTitle("Operation canceled. No changes were made.")
			}
			await confirmation.update({ embeds: [resultEmbed], components: [] });
		} catch (e) {
			console.log(e);
			resultEmbed.setColor("#FF0000");
			resultEmbed.setTitle("Confirmation not recieved within 1 minute. No changes were made.");
			resultEmbed.setTimestamp();
			await interaction.editReply({ embeds: [resultEmbed], components: [] });
		}
	} 
}       