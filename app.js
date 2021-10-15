const fs = require('fs');
global.AbortController = require('abort-controller');
// additional req

//
const { Client, Collection, Intents } = require('discord.js');
const { TOKEN, PREFIX } = require('./config.json');
const { PlayerObj } = require('./player.js');
const yt_search = require('yt-search');
const ytdl = require('ytdl-core-discord');
const {
	joinVoiceChannel,
	getVoiceConnection,
	createAudioPlayer,
	createAudioResource,
	AudioPlayer,
	AudioPlayerStatus,
	StreamType,
} = require('@discordjs/voice');
const { getVideoID } = require('ytdl-core');

// // Create a new client instance
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES,
		// Intents.FLAGS.GUILD_PRESENCES,
	],
});

// // reading command files
// client.commands = new Collection();
// const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

// for (const file of commandFiles) {
// 	const command = require(`./commands/${file}`);
// 	// Set a new item in the Collection
// 	// With the key as the command name and the value as the exported module
// 	client.commands.set(command.data.name, command);
// }

//
// console log function
//TODO add type in front e.g. player, guild, bot
//TODO color https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
function consoleLogFormator(string, date = false) {
	let hk_date_string = new Date().toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' });
	let date_hk = new Date(hk_date_string);
	// console.log(date_hk);
	// hours as (HH) format
	let hours = ('0' + date_hk.getHours()).slice(-2);

	// minutes as (mm) format
	let minutes = ('0' + date_hk.getMinutes()).slice(-2);

	// seconds as (ss) format
	let seconds = ('0' + date_hk.getSeconds()).slice(-2);

	// time as hh:mm:ss format
	let timeString = hours + ':' + minutes + ':' + seconds;

	if (date) {
		// month as (MM) format
		let month = ('0' + (date_hk.getMonth() + 1)).slice(-2);

		// date as (DD) format
		let date = ('0' + date_hk.getDate()).slice(-2);
		// date and time as YYYY-MM-DD hh:mm:ss format
		timeString = date + '/' + month + ' - ' + timeString;
	}

	console.log('[' + timeString + '] ' + string);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	consoleLogFormator('Ready!', true);
});

// replying to commands
// client.on('interactionCreate', async (interaction) => {
// 	consoleLogFormator('runned');
// 	if (!interaction.isCommand()) return;

// 	const command = client.commands.get(interaction.commandName);

// 	if (!command) return;

// 	try {
// 		await command.execute(interaction);
// 	} catch (error) {
// 		console.error(error);
// 		await interaction.reply({
// 			content: 'There was an error while executing this command!',
// 			ephemeral: true,
// 		});
// 	}
// });

// command Below
//
function helpFunction(client, message) {
	return false;
}

// server Dict
var serverDict = {};

class server {
	constructor(serverId) {
		this.id = serverId;
		this.connection = undefined;
		this.player = new PlayerObj(
			this,
			ytdl,
			joinVoiceChannel,
			getVoiceConnection,
			createAudioPlayer,
			createAudioResource,
			AudioPlayerStatus,
			StreamType
		);
	}
}

//* Server Function
function server_createDict(client, message) {
	consoleLogFormator('creating guild Object id: ' + message.guildId);
	let tempobj = new server(message.guildId);
	return tempobj;
}
function server_getGuild(client, message) {
	let guildId = message.guildId;
	if (serverDict.hasOwnProperty(guildId)) {
		return serverDict[guildId];
	} else {
		serverDict[guildId] = server_createDict(client, message);
		return serverDict[guildId];
	}
}

//* message related
async function removeMessageAfterSeconds(client, message, time) {
	return true;
}
//
//

//* Player Function
function player_createObj(client, message) {}
//
function getAuthorVCchannelFunction(client, message) {
	return message.member.voice.channel;
}
function getClientVCchannelFunction(client, message) {
	return message.guild.me.voice.channel;
}
//TODO
function player_ConnectFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	let authorVCchannel = getAuthorVCchannelFunction(client, message);
	let clientVCchannel = getClientVCchannelFunction(client, message);
	if (clientVCchannel !== null && authorVCchannel !== clientVCchannel) {
		// client in channel && client not in author channel
		if (guildObj.player.playList.length > 0) {
			return message.channel.send(`Please wait untill the queue is ended`);
		}
	}
	consoleLogFormator('trying to Connect VCchannel ID: ' + authorVCchannel.id);
	//! connect to author channel
	guildObj.player.connect(authorVCchannel);
}
//TODO
function player_DisconnectFunction(client, message) {
	let VCchannel = getClientVCchannelFunction(client, message);
	// console.log(VCchannel);
	if (VCchannel == null) {
		return message.channel.send('I am not in a Voice Channel');
	}
	let guildObj = server_getGuild(client, message);
	consoleLogFormator('trying to Disconnect VCchannel ID: ' + VCchannel.id);
	//! disconenct
	guildObj.player.disconnect();
}
//
async function player_PlayFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	// let url = message.content.split(' ').shift().join(' ');
	let url = message.content.split(' ');
	url.shift();
	url = url.join(' ');
	// console.log(url);
	if (!url) {
		player_ConnectFunction(client, message);
		guildObj.player.playNextSongifEnd();
		return;
	}
	if (!guildObj.player.connection) guildObj.player.connect(getAuthorVCchannelFunction(client, message));
	let addedSong = await guildObj.player.addSong(yt_search, url, message);
	if (!addedSong) return message.channel.send('no song added');
	guildObj.player.playNextSongifEnd();
}
//
function player_RemoveFromListFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	let index = message.content.split(' ')[2];
	if (parseInt(index, 10).toString() === index && index >= guildObj.player.playList.length) {
		guildObj.player.removeFromList(index, message);
		return true;
	}
	return message.channel.send(`${index} is not a correct index`);
}
//
function player_LoopFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	guildObj.player.loopSong();
}
function player_LoopQueueFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	guildObj.player.loopQueue();
}
//
function player_ListQueueFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	let stringToSend = '```\n';
	let urlList = guildObj.player.urlList;
	if (!urlList.length) {
		return message.channel.send('0 song in Queue');
	}
	for (let i = 0; i < urlList.length; i++) {
		stringToSend += `${i}. ${urlList[i]}\n`;
	}
	stringToSend += `Loop Song: ${guildObj.player.loopSongBool}\n`;
	stringToSend += `Loop Queue: ${guildObj.player.loopQueueBool}\n`;
	stringToSend += '```';
	message.channel.send(stringToSend);
}
//
function player_ResumeFunction(client, message) {
	//
	server_getGuild(client, message).player.resume();
}
//
function player_PauseFunction(client, message) {
	//
	server_getGuild(client, message).player.pause();
}
//
function player_SkipFunction(client, message) {
	//
	server_getGuild(client, message).player.skip();
}
//
function player_ClearFunction(client, message) {
	server_getGuild(client, message).player.clear();
}
//
function player_SeekFunction(client, message) {
	//
	return message.channel.send('Seek function is not avaliable due to library issues');
	let time = message.content.split(' ')[1];
	if (parseInt(time, 10).toString() === time && time >= 0) {
		server_getGuild(client, message).player.seek(time);
		return true;
	}
	return message.channel.send(`${time} is not a correct time in seconds`);
}

function getState(client, message) {
	let s = server_getGuild(client, message).player.getState();
	message.channel.send(`state: ${s}`);
}

// end of command function
var commandDict = {
	help: helpFunction,
	join: player_ConnectFunction,
	connect: player_ConnectFunction,

	leave: player_DisconnectFunction,
	disconnect: player_DisconnectFunction,
	//
	p: player_PlayFunction,
	play: player_PlayFunction,
	//
	remove: player_RemoveFromListFunction,
	loop: player_LoopFunction,
	loopq: player_LoopQueueFunction,
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
	clear: player_ClearFunction,
	//
	gs: getState,
};
// dict["key1"] = "value1";
// not exist => undefined
// check for key	dict.hasOwnProperty('key')
// delete key	delete dict.key
//

// prefix command
client.on('messageCreate', async (message) => {
	// consoleLogFormator('Recieved: ' + message.content);
	if (message.author.bot) return;
	if (message.content[0] != PREFIX) return;
	let firstArg = message.content.split(' ')[0].slice(1);
	consoleLogFormator('Recieved: ' + firstArg);
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

//
//
// Login to Discord with your client's token
client.login(TOKEN);
