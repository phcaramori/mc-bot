const Discord = require('discord.js');
const fetch = require('node-fetch')
const client = new Discord.Client();
const prefix ='-';

client.once('ready', () => {
    console.log("bot online")
})

client.on('message',message =>{
    console.log('message recieved');
    if(!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command == "help"){
        message.channel.send('Do ``-shophelp`` for help with shops and ``-datahelp`` for help wth the server datapacks. You can also do ``-seed`` to get the server seed and ``-ip`` for the ip.')
        //end of -help

    }else if(command == "shophelp"){
        message.channel.send("Use this link for help with setting up a shop: https://github.com/Shopkeepers/Shopkeepers-Wiki/wiki/Player-Shop-Setup. \n \n if you prefer a video tutorial: https://drive.google.com/file/d/1bCkEd1eRRrp7-0aErHWyzz5PMUSeeTur/view?usp=sharing \n \n You can make the shopkeeper almost any passive mob.(Cow, sheep, cat, and much more.) I suggest that you use a villager for most shops, but you can also use shop-appropriate mobs such as using an iron golem for a iron shop or a cow for a food shop. \n \n If you have any questions, feel free to dm Walnut_.")
        //end of -shophelp

    }else if(command == "datahelp"){
        message.channel.send("for a list of datapacks in the server, do ``/datapack list``. \n To use the spectator mode datapack, do ``/trigger .spectator``. That command toggles you in and out of spectator.")
        //end of -datahelp

    }else if(command == "ip"){
        message.channel.send(`Server IP: thiccniggasandanimebiches.pvp.host`)
        //end of -ip

    }else if(command == "seed"){
        message.channel.send(`Server seed: 6158718709991965043`)
        //end of -seed

    }else if(command == "online"){ 
        const embed = new Discord.MessageEmbed()
        let finalMessage = ''
        var playersOnline;
        var numOfPlayersOnline;
        //embed start
        async function run(){
            async function getData(){
                const api_url= 'https://api.mcsrvstat.us/2/thiccniggasandanimebiches.pvp.host'
                let settings = { method: "Get" }
                fetch(api_url, settings)
                .then(res => res.json())
                .then((json) => {
                    playersOnline = json.players.list
                    numOfPlayersOnline = json.players.online
                    if(numOfPlayersOnline){ //if there is any1 online
                        playersOnline.forEach(element => {
                            finalMessage = finalMessage + ' \n' + element 
                        });
                        embed.addField('Players on-line:', finalMessage)
                    } else if(!numOfPlayersOnline){//if there is no-one online
                        embed.addField("Players on-line:","The server is empty")
                        embed.footer("updates every 10 minutes")
                    }else{
                        message.channel.send("something went very, very wrong. TAKE ME OUT OF MY MISERY WALNUT")
                    }
                    embed.setColor('#f7ae2f')
                    message.channel.send(embed)
                })
            }
        await getData()   
        } 
        run()
        //end of -online
    }else{
        message.channel.send("Invalid command. Do -help for a list of commands.")
    }
})
client.login('NzQyNzk3MTI1ODQyMTA4NDU3.XzLVuw.jJGbLdDKJ-9wUEsoH7F_o6J5kBM')