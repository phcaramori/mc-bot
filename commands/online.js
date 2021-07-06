export function online() {
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

                    //making the embed with the results
                    playersOnline = json.players.list;
                    numOfPlayersOnline = json.players.online;

                    if (numOfPlayersOnline) { //if there is any1 online
                        playersOnline.forEach(element => {
                            finalMessage = finalMessage + ' \n' + element;
                        });
                        embed.addField('Players on-line:', finalMessage);
                        embed.setFooter("updates every 10 minutes");

                    }
                    else if (!numOfPlayersOnline) { //if there is no-one online
                        embed.addField("Players on-line:", "The server is empty");
                        embed.setFooter("updates every 10 minutes");
                        //
                    }
                    embed.setColor('#f7ae2f');
                    message.channel.send(embed);
                });
        }
        await getData();
    }
    run();
    //end of -online
}