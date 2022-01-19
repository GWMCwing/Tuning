// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { TOKEN } = require('./config.json');
const logging = require('./src/console/logging');
const { logginConstant } = require('./src/globalConstant/constant');
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	logging(logginConstant.type.info, 'Bot is ready!');
});

client.on('interactionCreate', async (interaction) => {
	// interaction.deferReply() to extend the time of the interaction to 15mins
	// or reply with initial message to extend the token to more than 15mins
	// use followUp
	if (!interaction.isCommand()) return;
	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
	}
});

// Login to Discord with your client's token
client.login(TOKEN);
