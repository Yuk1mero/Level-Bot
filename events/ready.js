const client = require("../index");

client.on("ready", () => {
    console.log(`${client.user.tag} is Online!`.blue)
    client.user.setActivity(`Vibing`, { type: "LISTENING" });
    //A Test Command
    
});
