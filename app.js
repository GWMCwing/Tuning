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

// commnand Below
//
function helpFunction(client, message) {
	return false;
}

// server Dict
var serverDict = {};

class server {
	constructor(serverId) {
		this.id = serverId;
		this.player = new PlayerObj();
	}
}

//* Server Function
function server_createDict(client, message) {
	return new server(message.guildId);
}
function server_getGuild(client, message) {
	if (serverDict.hasOwnProperty(message.guildId)) {
		return serverDict[message.guildId];
	} else {
		return server_createDict(client, message);
	}
}
//
//

//* Player Function
function player_createObj(client, message) {}
//
function getVCchannelFunction(client, message) {
	return message.member.voice.channel;
}

function player_ConnectFunction(client, message) {
	guildDict = server_getGuild(client, message);
	VCchannel = getVCchannelFunction(client, message);
}
//
function player_DisconnectFunction(client, message) {}
//
function player_PlayFunction(client, message) {}
//
function player_RemoveFromListFunction(client, message) {}
//
function player_LoopFunction(client, message) {}
//
function player_ListQueueFunction(client, message) {}
//
function player_ResumeFunction(client, message) {}
//
function player_PauseFunction(client, message) {}
//
function player_SkipFunction(client, message) {}
//
function player_SeekFunction(client, message) {}

//
// end of command function
var commandDict = {
	help: helpFunction,
	connect: player_ConnectFunction,
	disconnect: player_DisconnectFunction,
	//
	p: player_PlayFunction,
	play: player_PlayFunction,
	//
	remove: player_RemoveFromListFunction,
	loop: player_LoopFunction,
	// loop without arg = loop song
	// loop with -q = loop queue
	// when loop queue is true loop song is false, either one is true at a time
	//
	q: player_ListQueueFunction,
	queue: player_ListQueueFunction,
	//
	resume: player_ResumeFunction,
	pause: player_PauseFunction,
	//
	skip: player_SkipFunction,
	seek: player_SeekFunction,
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
		commandDict[firstArg](client, message);
	}
});
//

//
//
// Login to Discord with your client's token
client.login(TOKEN);
