const { Client,  MessageEmbed } = require("discord.js");
const Users = require(`../../events/levelmodel`)
module.exports = {
    name: 'rank',
    description: 'Get The Rank Of Users',
    categories : 'all',
    cooldown : 2,
    usage: 'rank [user]',
    examples: `rank @Yukimero`,


    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        Users.findOne({
          did: member.id,
          serverID: message.guild.id
      }, async (err, users) => {
          if (err) {
              console.log(err)
              return message.channel.send({content : `An Error Occured`})
          }
          
          let nxtlvl = 300 * Math.pow(2, users.level);
          var xpLeft = nxtlvl - users.xp;
          
          const embed = new MessageEmbed()
          .setTitle(`${member.user.username}#${member.user.discriminator}\`s Exp`)
          .setDescription(`Level : ${users.level} \n Progress : ${users.xp} / ${nxtlvl}`)
          .setColor("RANDOM")
          message.channel.send({embeds: [embed]})
      });
      }     
}