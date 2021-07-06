function online(message) {
    const Discord = require('discord.js');
    const fetch = require('node-fetch')
    const embed = new Discord.MessageEmbed();
    let finalMessage = '';
    var playersOnline;
    var numOfPlayersOnline;
    async function run() {
        async function getData() {

        //getting JSON results from API
        const api_url = 'https://api.mcsrvstat.us/2/51.161.84.204:25631';
        let settings = { method: "Get" };
        fetch(api_url, settings)
            .then(res => res.json())
            .then((json) => {
                console.log('got results')
                //making the embed with the results
                playersOnline = json.players.list;
                numOfPlayersOnline = json.players.online;

                if (numOfPlayersOnline) { //if there is any1 online
                    playersOnline.forEach(element => {
                        finalMessage = finalMessage + ' \n' + element;
                    });
                    embed.addField('Players on-line:', finalMessage);
                    embed.addField(`There are ${numOfPlayersOnline} players online.`)
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
        await getData();
    }
    run();
    //end of -online
}

module.exports.online = online;