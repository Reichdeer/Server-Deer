module.exports = {
	name: 'user-info',
	description:'Retrieves username and id',
	usage: '<no-args>',
	execute(message) {
		message.reply(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	},
};