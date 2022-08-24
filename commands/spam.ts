import  { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName("spam")
        .setDescription("Spams a message in chat for a specified number of times. Deletes your original message")
        
        ,
    usage: "-spam 5 this message will repeat 5 times.",
    command: function (message,args) {
        let loop = parseInt(args[0])
        if(!isNaN(loop)){
            if(loop>20){
                message.channel.send("don't.")
            }else{ 
                args.splice(0,1)
                let msg = args.join(' ')  
                message.delete()
                for(let i = 0; i < loop; i++){
                    message.channel.send(msg)
                }
            }
        }else{
            message.channel.send('First parameter must be a number')
        }
        
    }
}