const fs = require('fs');
// additional req
const { Client, Collection, Intents } = require('discord.js');
const { TOKEN, PREFIX } = require('./config.json');
const { PlayerObj } = require('./player.js');
//
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// reading command files
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// replying to commands
client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true,
		});
	}
});

var commandDict = {
	help: 'helpFunction',
	connect: 'player_ConnectFunction',
	disconnect: 'player_DisconnectFunction',
	//
	p: 'player_PlayFunction',
	play: 'player_PlayFunction',
	//
	remove: 'player_RemoveFromListFunction',
	loop: 'player_LoopFunction',
	// loop without arg = loop song
	// loop with -q = loop queue
	// when loop queue is true loop song is false, either one is true at a time
	//
	q: 'player_ListQueueFunction',
	queue: 'player_ListQueueFunction',
	//
	resume: 'player_ResumeFunction',
	pause: 'player_PauseFunction',
	//
	skip: 'player_SkipFunction',
	seek: 'player_SeekFunction',
};
// dict["key1"] = "value1";
// not exist => undefined
// check for key	dict.hasOwnProperty('key')
// delete key	delete dict.key
//

// prefix command
client.on('message', async (message) => {
	if (message.author.bot()) return;
	if (message.content[0] != PREFIX) return;
	let firstArg = message.content.split(' ')[0].slice(1);
	if (commandDict.hasOwnProperty(firstArg.toLowerCase())) {
		commandDict[firstArg](message);
	}
});
//

//
//
// Login to Discord with your client's token
client.login(TOKEN);
