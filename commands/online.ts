import {MC_SERVER_SETTINGS} from '../settings';
import  { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import https from 'https';

export default {
    data: new SlashCommandBuilder()
        .setName("online")
        .setDescription("lists all players that are currently on-line on the specified server IP")
        
        ,
    command: function (interaction){
        console.log('called')
        const embed = new EmbedBuilder();
        let finalMessage = '';
        var playersOnline: string[];
        var numOfPlayersOnline: number;
        
        //getting JSON results from API
        const api_url = 'https://api.mcsrvstat.us/2/' + MC_SERVER_SETTINGS.ip;
        let json: any;
        https.get(api_url, (resp) => {
            let data = "";

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                json = JSON.parse(data);
                playersOnline = json.players.list;
                numOfPlayersOnline = json.players.online;
                embed.setTimestamp()
                embed.setFooter({text: "updates every 10 minutes"});

                if (numOfPlayersOnline) { //if there is any1 online
                    playersOnline.forEach(element => {
                        finalMessage = finalMessage + ' \n' + element;
                    });
                    embed.addFields({name: 'Players on-line:', value: finalMessage});
                    embed.setColor('#f7ae2f');
                }

                else if (!numOfPlayersOnline) { //if there is no-one online      
                    embed.setTitle("The server is currently empty.");
                    embed.setColor('#ff0000');
                }      

                interaction.reply({ embeds: [embed], ephemeral: true});
            })
        }).on("error", (err) => {
            console.log("Error when fetching server info: " + err.message);
        })          
    }
}
 