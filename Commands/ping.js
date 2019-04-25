module.exports = {
	name: 'ping',
	description: 'Ping!',
	usage: '<beep, boo>',
	cooldown: 5,
	execute(message, args) {
		if (args[0] === "beep"){
			if (args[1] === "boo"){
				message.channel.send('Bop!');
			}else {
				message.channel.send("Boop.");
		    }
		}
		else {
			message.channel.send('Pong.');
		}
	},
};