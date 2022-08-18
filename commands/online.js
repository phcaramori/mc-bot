import SERVER_SETTINGS from '../settings.js';
import  {MessageEmbed} from 'discord.js';
import fetch from 'node-fetch';
export default function (message) {
    const embed = new MessageEmbed();
    let finalMessage = '';
    var playersOnline;
    var numOfPlayersOnline;
    //getting JSON results from API
    const api_url = 'https://api.mcsrvstat.us/2/' + SERVER_SETTINGS.ip;
    let settings = { method: "Get" };
    fetch(api_url, settings)
    .then(res => res.json())
    .then((json) => {
        //making the embed with the results
        playersOnline = json.players.list;
        numOfPlayersOnline = json.players.online;
        
        if (numOfPlayersOnline) { //if there is any1 online
            playersOnline.forEach(element => {
                finalMessage = finalMessage + ' \n' + element;
            });
            embed.addField('Players on-line:', finalMessage);
            embed.setFooter("updates every 10 minutes");
            embed.setColor('#f7ae2f');
        }
        else if (!numOfPlayersOnline) { //if there is no-one online      
            embed.setTitle("The server is currently empty.");
            embed.setFooter("updates every 10 minutes");
            embed.setColor('#ff0000');
        }      

        message.channel.send(embed);
    });
}
 