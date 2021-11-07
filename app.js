const fs = require('fs');
// additional req
const { Client, Collection, Intents } = require('discord.js');
const { TOKEN, PREFIX } = require('./config.json');
const yt_search = require('yt-search');
const ytdl = require('ytdl-core');
const {
	joinVoiceChannel,
	getVoiceConnection,
	createAudioPlayer,
	createAudioResource,
	AudioPlayer,
	AudioPlayerStatus,
	StreamType,
} = require('@discordjs/voice');

// require all needed files from ./scr
const bot = require('./scr/');
// // Create a new client instance
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES,
		// Intents.FLAGS.GUILD_PRESENCES,
	],
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
	consoleLogFormator('Ready!', true);
});

//TODO use Database to store all the data
var serverDict = {};

//? Could not think of another way to do this
const commandDict = {
	help: helpFunction,
	invite: inviteFunction,
	//
	changeprefix: server_ChangePrefixFunction,
	resetprefix: server_ResetPrefixFunction,
	//
	join: player_ConnectFunction,
	connect: player_ConnectFunction,

	leave: player_DisconnectFunction,
	disconnect: player_DisconnectFunction,
	//
	p: player_PlayFunction,
	play: player_PlayFunction,
	//
	remove: player_RemoveFromListFunction,
	rm: player_RemoveFromListFunction,
	loop: player_LoopFunction,
	loopq: player_LoopQueueFunction,
	//
	q: player_ListQueueFunction,
	queue: player_ListQueueFunction,
	np: player_NowPlayingFunction,
	//
	resume: player_ResumeFunction,
	pause: player_PauseFunction,
	//
	skip: player_SkipFunction,
	seek: player_SeekFunction,
	clear: player_ClearFunction,
	//
	// gs: getState,
};
// TODO Refactor
// prefix command
client.on('messageCreate', async (message) => {
	// consoleLogFormator('Recieved: ' + message.content);
	if (message.author.bot) return;
	let guildObj = server_getGuild(client, message);
	if (message.mentions.members.first().id == message.guild.me.id && message.content.search('help') !== -1) {
		return helpFunction(client, message);
	}
	//!!!!!!
	let firstChar = message.content[0];
	if (firstChar != guildObj.prefix || firstChar != PREFIX) return;
	let firstArg = message.content.split(' ')[0].slice(1);
	//
	if (firstArg == 'resetprefix') {
		return server_ResetPrefixFunction(client, message);
	}
	// consoleLogFormator(`Recieved: ${firstArg}`);
	if (firstChar != guildObj.prefix) return;
	if (commandDict.hasOwnProperty(firstArg.toLowerCase())) {
		try {
			commandDict[firstArg](client, message);
		} catch (error) {
			//TODO add custom error to the log
			consoleLogFormator(`Error occured\n        message: ${message.content}`, true);
			console.log(error);
		}
	} else {
		sentMessage = message.channel.send(`Unknown Command: ${firstArg}`);
		removeMessageAfterSeconds(client, sentMessage, 3);
	}
});
//

// Login to Discord with your client's token
client.login(TOKEN);
