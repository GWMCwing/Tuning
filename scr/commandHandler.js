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
	consoleLogFormator(`recieved: ${message}\ncommand: ${command}\nargs: ${args}`);
	//TODO pass function
}

//
/**
 * map all the avaliable commands to the corresponding function
 */
const commandDictionary = {
	// 'command' : function
	// all in lowerCase
	help: bot.helpMessage,
	invite: '',
	//
	changeprefix: '',
	resetprefix: '',
	//
	join: '',
	connect: '',
	leave: '',
	disconnect: '',
	//
	p: '',
	play: '',
	remove: '',
	rm: '',
	loop: '',
	loopq: '',
	loopqueue: '',
	//
	q: '',
	queue: '',
	np: '',
	//
	resume: '',
	pause: '',
	//
	skip: '',
	stop: '',
	seek: '',
	clear: '',
	//
	volume: '',
	//
};

//
// Export
module.exports = { commandHandler };
