function owo(message) {
    const owoify = require("owoify-js").default;

    let owoified = message.content.slice(5) //remove first 5 characters of the message (Ex: "-owo hello dude" turns into "hello dude")
        message.delete();
        message.channel.send(owoify(owoified, "owo")); 
}
function uwu (message) {
    const owoify = require("owoify-js").default;

    let owoified = message.content.slice(5) //remove first 5 characters of the message (Ex: "-owo hello dude" turns into "hello dude")
        message.delete();    
        message.channel.send(owoify(owoified, "uwu")); 
}

export { owo };
export { uwu };