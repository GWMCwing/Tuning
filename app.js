// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { TOKEN, PREFIX } = require('./config.json');
const logging = require('./src/console/logging');
const { loggingConstant } = require('./src/globalConstant/constant');
const {
	messageDestructor,
	messageToCommandObject,
} = require('./src/command/commandHandler');
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	logging(
		loggingConstant.type.info,
		loggingConstant.tag.runtime,
		'Bot is ready!'
	);
});

client.on('interactionCreate', async (interaction) => {
	// interaction.deferReply() to extend the time of the interaction to 15mins
	// or reply with initial message to extend the token to more than 15mins
	// use followUp
	if (interaction.isCommand()) {
		const { commandName } = interaction;
		logging(
			loggingConstant.type.debug,
			loggingConstant.tag.command,
			`Interaction Received: Command: ${commandName}`
		);
		const commandObject = messageToCommandObject(commandName);
		if (commandObject) {
			await commandObject.function((interaction = interaction));
		}
	} else if (interaction.isButton()) {
		const { customId: buttonId } = interaction;
		logging(
			loggingConstant.type.debug,
			loggingConstant.tag.command,
			`Interaction Received: Button: ${buttonId}`
		);
	}
});
//
//
client.on('messageCreate', async (message) => {
	if (message.content.startsWith(PREFIX)) {
		logging(
			loggingConstant.type.debug,
			loggingConstant.tag.message,
			`Message Received: ${message.content}`
		);
		let { command, args } = messageDestructor(message);
		const commandObject = messageToCommandObject(command);
		if (commandObject) {
			await commandObject.function((message = message), (args = args));
		}
	}
});

// Login to Discord with your client's token
client.login(TOKEN);
