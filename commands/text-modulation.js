export function owo() {
    let owoified = message.content.slice(5) //remove first 5 characters of the message (Ex: "-owo hello dude" turns into "hello dude")
        message.channel.send(owoify(owoified, "owo")); 
        message.delete();
}
export function uwu () {
    let owoified = message.content.slice(5) //remove first 5 characters of the message (Ex: "-owo hello dude" turns into "hello dude")
        message.channel.send(owoify(owoified, "uwu")); 
        message.delete();
}