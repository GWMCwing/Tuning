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
		options: [
			{
				name: 'ping',
				description: 'ping something',
				type: 2, // 2 is type SUB_COMMAND_GROUP
				options: [
					{
						name: 'user',
						description: 'ping the user',
						type: 1, // 1 is type SUB_COMMAND
						options: [
							{
								name: 'user',
								description: 'the user to ping',
								type: 6,
								required: true,
							},
						],
					},
					{
						name: 'role',
						description: 'ping the role',
						options: [],
						type: 1, // 1 is type SUB_COMMAND
					},
				],
			},
		],
		/** @type {Function} */
		function: 'helpfunction',
	},
	ping: {
		name: 'ping',
		description: 'Pong!',
		options: [
			{
				name: 'input',
				type: 3,
				description: 'The input to be ponged.',
				required: false,
			},
		],
		/** @type {function} */
		function: require('../general/ping'),
	},
	user: {
		name: 'user',
		description: 'Displays your user information.',
		options: [],
		/** @type {function} */
		function: require('../client/clientInformation'),
	},
	server: {
		name: 'server',
		description: 'Displays server information.',
		options: [],
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
