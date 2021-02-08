const Discord = require('discord.js');
const fetch = require('node-fetch');
const owoify = require("owoify-js").default
//
const client = new Discord.Client();
const prefix ='-';

client.once('ready', () => {
    console.log("bot online")
})

client.on('message',message =>{
    console.log('message recieved');
    if(!message.content.startsWith(prefix)) return; //if message doesn't begin with the prefix, stop.

    const args = message.content.slice(prefix.length).split(/ +/); //returns array with all words in the command. Ex: ["help","how","to","do","this"]
    const command = args.shift().toLowerCase(); //returns only the first word in the command. Ex: "help"

    console.log(command)

    //start of commands

    if(command == "help"){
        const embed = new Discord.MessageEmbed();
        embed.addField("Help",".")
        embed.addField("-shophelp","Used for help with setting up shops")
        embed.addField("-seed", "Used to find the world's seed")
        embed.addField("-ip", "Used to find the server's ip")
        embed.addField("-online", "Used to get a list of what players are currently on the server")
        embed.setColor('#7f7f7f')
        message.channel.send(embed)
        //end of -help

    }else if(command == "shophelp"){
        message.channel.send("Use this link for help with setting up a shop: https://github.com/Shopkeepers/Shopkeepers-Wiki/wiki/Player-Shop-Setup. \n \n If you have any questions, feel free to dm Walnut_.")
        //end of -shophelp

    }else if(command == "ip"){
        message.channel.send("Server IP: ``170.81.41.61.ipv4.reishosting.com.br:26056``")
        //end of -ip

    }else if(command == "seed"){
        message.channel.send("World Seed: ``3585869031427545926``")
        //end of -seed

    }else if(command == "online"){ 
        const embed = new Discord.MessageEmbed()
        let finalMessage = ''
        var playersOnline;
        var numOfPlayersOnline;
        
        async function run(){
            async function getData(){
                
                //getting JSON results from API
                const api_url= 'https://api.mcsrvstat.us/2/170.81.41.61.ipv4.reishosting.com.br:26056'
                let settings = { method: "Get" }
                fetch(api_url, settings)
                .then(res => res.json())
                .then((json) => {

                    //making the embed with the results
                    playersOnline = json.players.list
                    numOfPlayersOnline = json.players.online

                    if(numOfPlayersOnline){ //if there is any1 online
                        playersOnline.forEach(element => {
                            finalMessage = finalMessage + ' \n' + element 
                        });
                        embed.addField('Players on-line:', finalMessage)
                        embed.setFooter("updates every 10 minutes")

                    }
                    else if(!numOfPlayersOnline){//if there is no-one online
                        embed.addField("Players on-line:","The server is empty")
                        embed.setFooter("updates every 10 minutes")
                        //
                    }
                    embed.setColor('#f7ae2f')
                    message.channel.send(embed)
                })
            }
        await getData()   
        } 
        run()
        //end of -online

    }else if(command == "ping"){
        message.channel.send("pong")
        //end of -ping

    }else if(command == "owo"){
        let owoified = message.content.slice(5) //remove first 5 characters of the message (Ex: "-owo hello dude" turns into "hello dude")
        message.channel.send(owoify(owoified, "owo")); 
        message.delete();
    }else if(command == "uwu"){
        let owoified = message.content.slice(5) //remove first 5 characters of the message (Ex: "-owo hello dude" turns into "hello dude")
        message.channel.send(owoify(owoified, "uwu")); 
        message.delete();
    }
    else{
        message.channel.send("Invalid command. Do -help for a list of commands.")
    }
})
client.login('NzQyNzk3MTI1ODQyMTA4NDU3.XzLVuw.jJGbLdDKJ-9wUEsoH7F_o6J5kBM')