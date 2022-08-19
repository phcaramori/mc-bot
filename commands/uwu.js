
export default {
    name: "uwuify",
    aliases: ["uwu"],
    description: "uwuifies your message",
    command: function (message) {
        let owoified = message.content.slice(5) //remove first 5 characters of the message (Ex: "-owo hello dude" turns into "hello dude")
        message.channel.send(owoify(owoified, "uwu")); 
    }
}