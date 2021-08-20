const { Client,  MessageEmbed } = require("discord.js");
const Users = require(`../../events/levelmodel`)
module.exports = {
    name: 'lb',
    aliases: [`leaderboard`],
    description: 'leaderboard for the server',
    categories : 'all',
    cooldown : 2,
    usage: 'lb',
    examples: `lb`,


    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        Users.find({
            serverID: message.guild.id
        }).sort([
            ['xp', 'descending']
        ]).exec((err, res) => {
        if(err) console.log(err);
        let embed = new MessageEmbed()
        .setTitle(`${message.guild.name}\`s Leaderboard`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription("Here Is The Top 10 People In Our Server")
        if(res.length === 0){
            //if no result
            embed.setColor("#351B96")
            embed.addField("No Users Have Levels")
        }else if(res.length < 10){
            //if less than 10
            embed.setColor("#351B96")
            for(i = 0; i < res.length; i++){
                let member = message.guild.members.cache.get(res[i].did) || "No User"
                if(member === "No User"){
                    embed.addField(`${i+1}. ${member}`, `**Level**: ${res[i].level} || **XP**: ${res[i].xp}`)
        
                }else{
                    embed.addField(`${i+1}. ${member.user.username}`, `**Level**: ${res[i].level} || **XP**: ${res[i].xp}`)
                }
            }
        }else{
            //if more than 10
            embed.setColor("#351B96")
            for(i = 0; i < 10; i++){
                let member = message.guild.members.get(res[i].did) || "No User"
                if(member === "No User"){
                    embed.addField(`${i+1}. ${member}`, `**Level**: ${res[i].level} || **XP**: ${res[i].xp}`)
        
                }else{
                    embed.addField(`${i+1}. ${member.user.username}`, `**Level**: ${res[i].level} || **XP**: ${res[i].xp}`, true)
                }
            }
        }
           message.channel.send({embeds: [embed]})
    })
}};