/**
 * @global
 * @description dictionary implementation of commands. The key is the command name and the value is the command object.
 * The command Dictionary will also be used as the command deployment dictionary.
 * @var {object}
 */
//TODO these commands should be in declared in the corresponding command file
// a reference to the commands should be used in this commandHandler file
const commandDictionary = {
	help: {
		name: 'help',
		description: 'Displays the help message.',
		function: require('../general/helpMessage').replyHelpMessage,
		options: [],
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
 * @description get the command object from the command dictionary
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
