const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const Canvas = require('canvas');
const snekfetch = require('snekfetch');

const {prefix, token} = require('./config.json');
const cooldowns = new Discord.Collection();

client.commands = new Discord.Collection(); 
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

//show that client is ready
client.once('ready', () =>{
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message=>{
	//Check if user is using prefix or is bot.
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	//Seperates the prefix and splits the rest of the string and places it into a command
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	//argument handler
	if (command.args && !args.length){
		let reply = `You didn't provide any arguments, ${message.author}.`;
		if (command.usage){
			reply += `The proper usage is: \`${prefix}${commandName}${command.usage}\``;
		}
		return message.channel.send(reply);
	}

	//Commands.

	if (!command) return;

	if (!cooldowns.has(command.name)){
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)){
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime){
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing \`${commandName}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try{
		command.execute(message, args);
	} catch (e) {
		console.error(e);
		message.reply("Error running command");
	}
});

//bot login 
client.login(token);