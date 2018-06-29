const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');

client.on('ready', () => {
  console.log('ready!');
  client.user.setUsername('Orbital Reporter No.47051');
  client.user.setAvatar('./avatar.png');
  client.user.setPresence({status: 'busy', game : {name: '.st for planets status'}})
}); 

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  
  client.commands.set(command.name, command);
}

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  

    const args = message.content.slice(prefix.length).split(' ');
    const commandName = args.shift().toLowerCase();
  
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  
    if (!command) return;
  
    if (command.args && !args.length) {
      let reply = `You didn't provide enough arguments, ${message.author}`;
    
      if (command.usage) {
        reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
      }
    
      return message.channel.send(reply);
    }
  
    try {
      command.execute(message, args);
    }
    catch(error) {
      console.error(error);
      message.reply('there was an error executing this command');
    }

  
});

client.login(token);