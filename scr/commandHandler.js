const { consoleLogFormator } = require('./console/consoleLogFormator');
const bot = require('./index');
//
/**
 * handle all the command from the user, and call the corresponding function
 *
 * @param {object} client
 * @param {object} message
 * @param {object} guildObj
 * @param {string} command command already lowercase
 * @param {string[]} args
 */
function commandHandler(client, message, guildObj, command, args) {
	//
	consoleLogFormator(`Recieved: ${message}\ncommand: ${command}\nargs: ${args}`);
	//TODO pass function
	commandDictionary[command](client, message, args, guildObj);
}

function ToBeImplemented(client, message, args, guildObj) {
	message.channel.send('This command has not been implemented');
}
//
/**
 * map all the avaliable commands to the corresponding function
 */
const commandDictionary = {
	// 'command' : function
	// all in lowerCase
	help: bot.helpMessage,
	invite: bot.inviteMessage,
	//
	changeprefix: bot.server_ChangePrefix,
	resetprefix: bot.server_ResetPrefix,
	//
	join: bot.audio_Connect,
	connect: bot.audio_Connect,
	leave: bot.audio_Disconnect,
	disconnect: bot.audio_Disconnect,
	//
	p: bot.addToQueue,
	play: bot.addToQueue,
	//
	remove: ToBeImplemented,
	rm: ToBeImplemented,
	//
	loop: ToBeImplemented,
	loopq: ToBeImplemented,
	loopqueue: ToBeImplemented,
	//
	q: ToBeImplemented,
	queue: ToBeImplemented,
	//
	np: ToBeImplemented,
	//
	resume: ToBeImplemented,
	pause: ToBeImplemented,
	//
	skip: ToBeImplemented,
	//
	stop: ToBeImplemented,
	//
	seek: ToBeImplemented,
	//
	clear: ToBeImplemented,
	//
	volume: ToBeImplemented,
	//
};

//
// Export
module.exports = { commandHandler };
