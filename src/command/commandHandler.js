/**
 * @global
 * @description dictionary implementation of commands. The key is the command name and the value is the command object.
 * The command Dictionary will also be used as the command deployment dictionary.
 * @var {object}
 */
const commandDictionary = {
	help: {
		description: 'Displays help message.',
		/** @type {Function} */
		function: 'helpfunction',
	},
	ping: {
		description: 'Pong!',
		/** @type {function} */
		function: require('../general/ping'),
	},
	user: {
		description: 'Displays your user information.',
		/** @type {function} */
		function: require('../client/clientInformation'),
	},
	server: {
		description: 'Displays server information.',
		/** @type {function} */
		function: require('../guild/information/guildinfo'),
	},
};

/**
 *  @description Destructures the message and returns the command and the arguments.
 *
 * @param {object} message discordjs message object
 * @returns {{command: string, args: string[] }} object containing the command and the arguments
 */
function messageDestructor(message) {
	/**@type {string[]}*/
	let messageArray = message.content.split(' ');
	/**@type {string}*/
	const command = messageArray.shift().slice(1);
	/**@type {string[]}*/
	const args = messageArray;
	return { command, args };
}
/**
 *
 * @param {string} command
 * @returns {object} commandDictionary
 */
function messageToCommandObject(command) {
	return commandDictionary[command];
}

module.exports = {
	messageDestructor,
	messageToCommandObject,
	commandDictionary,
};
