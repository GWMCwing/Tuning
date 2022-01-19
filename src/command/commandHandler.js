/**
 * dictionary implementation of commands
 * @global
 * @var {object}
 */
const commandDictionary = {
	/** @var {object} */
	help: {
		/** @type {string} */
		description: 'Displays this message.',
		/** @type {function} */
		function: helpFunction,
	},
	ping: {
		/** @type {string} */
		/** @type {function} */
		description: 'Pong!',
		function: pingFunction,
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

module.exports = { messageDestructor, messageToCommandObject };
