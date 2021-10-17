const fs = require('fs');
// additional req
const { Client, Collection, Intents } = require('discord.js');
const { TOKEN, PREFIX } = require('./config.json');
const { PlayerObj } = require('./player.js');
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

// // Create a new client instance
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES,
		// Intents.FLAGS.GUILD_PRESENCES,
	],
});

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

// command Below
//
function helpFunction(client, message) {
	let helpWebUrl = 'https://github.com/GWMCwing/AuditBot/blob/master/docs/helpList.md';
	let prefixServer = server_getGuild(client, message).prefix;
	let msg = 'This guild uses ```' + prefixServer + '``` as prefix\n';
	msg += `Please visit the below website for complete command list: ${helpWeb}`;
	return message.channel.send(msg);
}

function inviteFunction(client, message) {
	return message.channel.send(
		'Please use this Link to invite the bot:\n https://discord.com/oauth2/authorize?client_id=670964358393888768&permissions=137442454592&scope=bot'
	);
}

// server Dict
var serverDict = {};

class server {
	constructor(serverId) {
		this.id = serverId;
		this.prefix = PREFIX;
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
function server_ResetPrefixFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	guildObj.prefix = PREFIX;
	message.channel.send(`New Prefix: ${guildObj.prefix}`);
}
function server_ChangePrefixFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	guildObj.prefix = message.content.split(' ')[1];
	message.channel.send(`New Prefix: ${guildObj.prefix}`);
}

//* message related
//TODO
async function removeMessageAfterSeconds(client, message, time) {
	return true;
}
//
//

//* Player Function
function getAuthorVCchannelFunction(client, message) {
	return message.member.voice.channel;
}
function getClientVCchannelFunction(client, message) {
	return message.guild.me.voice.channel;
}
/**
 *
 * Code: 0 => allow
 * 		 10 => Author not in Voice channel
 * 		 11 => Author not in same voice channel as client && urlList > 0
 * 		 20 => Client not in Voice channel
 *
 * @param {client} client
 * @param {message} message
 * @returns
 */
function checkAuthorInChannel(client, message) {
	let authorVC = getAuthorVCchannelFunction(client, message);
	let clientVC = getClientVCchannelFunction(client, message);
	if (!authorVC) return [10, authorVC, clientVC];
	else if (!clientVC) return [20, authorVC, clientVC];
	else if (authorVC != clientVC && server_getGuild(client, message).player.urlList.length != 0)
		return [11, authorVC, clientVC];
	return [0, authorVC, clientVC];
}
function player_ConnectFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 11) return message.channel.send('Please wait until the queue ended');
	if (code == 10) return message.channel.send('Please enter a Voice channel');
	consoleLogFormator(`Trying to Connect VCchannel ID: ${authorVC.id} at ${guildObj.id}`);
	//! connect to author channel
	guildObj.player.connect(message, authorVC);
}

function player_DisconnectFunction(client, message) {
	if (VCchannel == null) {
		return message.channel.send('I am not in a Voice Channel');
	}
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 10) return message.channel.send('You are not in the same Voice Channel');
	let guildObj = server_getGuild(client, message);
	consoleLogFormator(`Trying to Connect VCchannel ID: ${clientVC.id} at ${guildObj.id}`);
	//! disconenct
	guildObj.player.disconnect();
}
//
async function player_PlayFunction(client, message) {
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 10) return message.channel.send('Please enter a voice channel');
	if (code == 11) return message.channel.send('Please wait until the queue ended');
	let guildObj = server_getGuild(client, message);
	// let url = message.content.split(' ').shift().join(' ');
	let url = message.content.split(' ');
	url.shift();
	url = url.join(' ');
	// console.log(url);
	if (!url) {
		player_ConnectFunction(client, message);
		guildObj.player.playNextSongifEnd(message, false, 0);
		return;
	}
	if (!guildObj.player.connection || clientVC.members.size == 1) guildObj.player.connect(message, authorVC);
	let addedSong = await guildObj.player.addSong(yt_search, url, message);
	if (!addedSong) return message.channel.send('no sound track added');
	message.channel.send('Added: ```' + guildObj.player.urlList.at(-1)[1] + ' ```');
	guildObj.player.playNextSongifEnd(message, false, 0);
}
//
function player_RemoveFromListFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	if (guildObj.player.urlList.length == 0) return message.channel.send('No sound track is in queue');
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 11) return message.channel.send('You are not in the same Voice Channel');
	//
	let indexStr = message.content.split(' ')[1];
	let index = parseInt(indexStr, 10);
	if (index.toString() === indexStr && index < guildObj.player.urlList.length) {
		guildObj.player.removeFromList(index, message);
		return true;
	}
	return message.channel.send(`${index} is not a correct index`);
}
//
function player_LoopFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	if (guildObj.player.urlList.length == 0) return message.channel.send('No sound track is in queue');
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 11) return message.channel.send('You are not in the same Voice Channel');
	guildObj.player.loopSong();
	return message.channel.send(`Loop sound track: ${guildObj.player.loopSongBool}`);
}
function player_LoopQueueFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	if (guildObj.player.urlList.length == 0) return message.channel.send('No sound track is in queue');
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 11) return message.channel.send('You are not in the same Voice Channel');
	guildObj.player.loopQueue();
	return message.channel.send(`Loop Queue: ${guildObj.player.loopQueueBool}`);
}
//
function player_ListQueueFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	let stringToSend = '```\n';
	let urlList = guildObj.player.urlList;
	if (!urlList.length) {
		return message.channel.send('0 sound track in Queue');
	}
	for (let i = 0; i < urlList.length; i++) {
		stringToSend += `${i}. ${urlList[i][1]}\n`;
		stringToSend += `      ${urlList[i][0]}\n`;
	}
	stringToSend += `Loop sound track: ${guildObj.player.loopSongBool}\n`;
	stringToSend += `Loop Queue: ${guildObj.player.loopQueueBool}\n`;
	stringToSend += '```';
	message.channel.send(stringToSend);
}
//
function player_NowPlayingFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	return message.channel.send(`Now Playing: ${guildObj.player.urlList[0][1]}`);
}
//
function player_ResumeFunction(client, message) {
	//
	let guildObj = server_getGuild(client, message);
	if (guildObj.player.urlList.length == 0) return message.channel.send('No sound track is in queue');
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 11) return message.channel.send('You are not in the same Voice Channel');
	guildObj.player.resume();
	return message.channel.send('Resumed playing');
}
//
function player_PauseFunction(client, message) {
	//
	let guildObj = server_getGuild(client, message);
	if (guildObj.player.urlList.length == 0) return message.channel.send('No sound track is in queue');
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 11) return message.channel.send('You are not in the same Voice Channel');
	guildObj.player.pause();
	return message.channel.send('Paused playing');
}
//
function player_SkipFunction(client, message) {
	//
	let guildObj = server_getGuild(client, message);
	if (guildObj.player.urlList.length == 0) return message.channel.send('No sound track is in queue');
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 11) return message.channel.send('You are not in the same Voice Channel');
	guildObj.player.skip();
}
//
function player_ClearFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	if (guildObj.player.urlList.length == 0) return message.channel.send('No sound track is in queue');
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 11) return message.channel.send('You are not in the same Voice Channel');
	guildObj.player.clear();
}
//
function player_SeekFunction(client, message) {
	//
	return message.channel.send('Seek function is not avaliable due to library issues');
	let guildObj = server_getGuild(client, message);
	if (guildObj.player.urlList.length == 0) return message.channel.send('No sound track is in queue');
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 11) return message.channel.send('You are not in the same Voice Channel');
	let timeStr = message.content.split(' ')[1];
	let time = parseInt(timeStr, 10);
	if (time.toString() === timeStr && time >= 0) {
		guildObj.player.seek(message, time);
		return true;
	}
	return message.channel.send(`${time} is not a correct time in seconds`);
}

function getState(client, message) {
	let s = server_getGuild(client, message).player.getState();
	message.channel.send(`state: ${s}`);
}

// end of command function
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
	gs: getState,
};

// prefix command
client.on('messageCreate', async (message) => {
	// consoleLogFormator('Recieved: ' + message.content);
	if (message.author.bot) return;
	let guildObj = server_getGuild(client, message);
	//!!!!!!
	if (message.content[0] != guildObj.prefix || message.content[0] != PREFIX) return;
	//
	let firstArg = message.content.split(' ')[0].slice(1);
	if (firstArg == 'resetprefix') {
		return server_ResetPrefixFunction(client, message);
	}
	// consoleLogFormator(`Recieved: ${firstArg}`);
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
