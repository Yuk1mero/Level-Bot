const { MessageEmbed, Collection } = require("discord.js");
var config = require("../config/config.json");
const client = require("..");
const yuricanvas = require("yuri-canvas");
const Users = require(`./levelmodel`)
const prefix = config.prefix;
const Discord = require(`discord.js`)
const Canvas = require(`canvas`);
const { Message } = require("discord.js");
client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  const { escapeRegex, onCoolDown } = require("../utils/function");
  if (message.webhookId) return;
  if (message.channel.partial) await message.channel.fetch();
  if (message.partial) await message.fetch();
  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(config.prefix)})\\s*`
  );
  if (!prefixRegex.test(message.content)) return;
  const [, matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  const xpAdd = Math.floor(Math.random() * 20) + 10
  Users.findOne({
    did: message.author.id,
    serverID: message.guild.id
  }, (err, users) => {
    if (err) console.log(err);
    if (!users) {
      var newUsers = new Users({
        did: message.author.id,
        username: message.author.username,
        serverID: message.guild.id,
        xp: xpAdd,
        level: 0,
        avatarURL: message.author.displayAvatarURL()
      })

      newUsers.save().catch(error => console.log(error));
    } else {
      users.xp = users.xp + xpAdd;
      users.username = message.author.username
      users.avatarURL = message.author.displayAvatarURL()

      let nxtlvl = 300 * Math.pow(2, users.level)
      if (users.xp >= nxtlvl) {
        users.level = users.level + 1

        let thelvl = 300 * Math.pow(2, users.level)

        var other = thelvl - users.xp

        message.channel.send(`${message.author} You have leveled up to ${users.level}. Now You Need ${other} More Exp To Level Up Again`)
      }
      users.save().catch(error => console.log(error));
      if (users.level === `5`){
        var role5 = message.guild.roles.cache.find(role => role.id === "876757301187452929");
        message.author.roles.add(role5)
        }
      
      

    }
  });




  const command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.find(
      (c) => c.aliases && c.aliases.includes(cmd.toLowerCase())
    );
  if (!command) return;
  if (command) {
    let perms = new MessageEmbed().setDescription(
      `You don't Have ${command.permissions} To Run Command..`
    );
    if (!message.member.permissions.has(command.permissions || []))
      return message.channel.send({ embeds: [perms] }).catch(console.error)


    if (!message.guild.me.permissions.has(command.botpermissions || []))
      return message.channel.send({ content: `I need the ${command.botpermissions} permission to do this` }).catch(console.error)

    if (onCoolDown(message, command)) {
      let cool = new MessageEmbed()
        .setColor("DARK_VIVID_PINK")
        .setDescription(`Please wait ${onCoolDown(message, command)} more Second(s) before reusing the ${command.name} command.`)
      return message.channel.send({ embeds: [cool] }).catch(console.error)
    }
    await command.run(client, message, args, prefix).catch(console.error)
  }







});






