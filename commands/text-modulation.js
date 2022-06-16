import _owoify from "owoify-js";
let owoify = _owoify.default
function owo(message) {
    let owoified = message.content.slice(5) //remove first 5 characters of the message (Ex: "-owo hello dude" turns into "hello dude")
    message.channel.send(owoify(owoified, "owo")); 
}
function uwu (message) {
    let owoified = message.content.slice(5) //remove first 5 characters of the message (Ex: "-owo hello dude" turns into "hello dude")
    message.channel.send(owoify(owoified, "uwu")); 
}

export { owo };
export { uwu };