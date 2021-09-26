//TODO send command button
//TODO log output to webpage
// config
const javaPath = 'C:/Program Files/AdoptOpenJDK/jre-16.0.1.9-hotspot/bin/java.exe';
const webServerPort = 8965;
var defaultDelay = 12 * 60 * 60 * 1000; // 12 hrs
// javaArg template ['-Xmx2048M', '-Xms256M', '-jar', 'minecraft_server.1.17.jar', 'nogui']
const javaArg = ['-Xmx4G', '-Xms4G', '-jar', 'fabric-server-launch.jar'];
const commandRole_id = '856708794955071489';
const commandRoleREQUIRED = true;
//
//
// const javaPath = 'C:/Program Files/Java/jdk-16.0.1/bin/java.exe';
// const webServerPort = 3030;
// var defaultDelay = 3 * 60 * 60 * 1000; // 3 hrs
// // javaArg template ['-Xmx2048M', '-Xms256M', '-jar', 'minecraft_server.1.17.jar', 'nogui']
// const javaArg = ['-Xmx2048M', '-Xms256M', '-jar', 'minecraft_server.1.17.jar', 'nogui'];

//

// Require Node.js standard library function to spawn a child process
const spawn = require('child_process').spawn;

//
var startLogging = false;
var minecraftServerProcess;
var serverAction = false;
var startUptime = undefined;
var playerList = [];

// deathlog must be <player> deathLogArg
// string.split(' ')[2] = <player>
// string.split(' ')[3] = deathLogArg
const deathLogArg = [
	'was',
	'walked',
	'drowned',
	'experienced',
	'blew',
	'hit',
	'fell',
	'went',
	'burned',
	'tried',
	'discovered',
	'froze',
	'starved',
	'suffocated',
	"didn't",
	'withered',
	'died',
];
//
function log(data) {
	process.stdout.write(data.toString());
	serverChatToDiscord(data.toString());
	if (!startLogging) {
		startLoggingFun(data.toString());
	} else {
		logServerlog(data.toString());
		countPlayer(data.toString());
	}
}

function startLoggingFun(str) {
	if (str.search('Done ') != -1) {
		if (str.search('For help, type "help"') != -1) {
			startLogging = true;
		}
	}
}

// string.search('joined the game') != -1 || string.search('left the game') != -1
function countPlayer(string) {
	if (string[33] !== '<') {
		if (string.search('joined the game') != -1) {
			let playerName = string.split(' ')[3];
			let time = new Date().getTime();
			playerList.push([playerName, time]);
			//
		} else if (string.search('left the game') != -1) {
			let playerName = string.split(' ')[3];
			// let index = playerList.indexOf(playerName);
			let index = findInArray2D(playerList, 0, playerName);
			playerList.splice(index, 1);
			//
		}
	}
}

async function startMinecraftServer() {
	// Create a child process for the Minecraft server using the same java process
	// invocation we used manually before
	logTime(`\n Starting Server \n`, 'Server-Info');
	// client.channels.cache.get(log_channel_id).send('```\nStarting Server\n```');
	minecraftServerProcess = spawn(javaPath, javaArg);

	// Listen for events coming from the minecraft server process - in this case,
	// just log out messages coming from the server

	//

	minecraftServerProcess.stdout.on('data', log);
	minecraftServerProcess.stderr.on('data', log);
	startUptime = new Date().getTime();
	playerList = [];
	//

	forcedRestartTimer(defaultDelay);
	//
	return 'started Server';
}

function tellServer(string, color = undefined) {
	let msg = '';
	if (color) {
		msg = `/tellraw @a {"text":"${string}","color":"${color.toLowerCase()}"}\n`;
	} else {
		msg = `/tellraw @a "${string}"\n`;
	}
	try {
		minecraftServerProcess.stdin.write(msg);
	} catch (error) {
		logTime(error, 'DiscordBot-Error');
	}
}

async function forcedRestartTimer(delayTimer) {
	//
	tellServer(`Server Restart in ${Math.ceil(delayTimer / 1000)} seconds`, 'red');
	// /tellraw @a {"text":"I am blue","color":"blue"}
	logTime(`Server Restart in ${Math.ceil(delayTimer / 1000)} seconds`, 'Server-Info');
	// 10 mins before
	if (delayTimer > 10 * 60 * 1000) {
		await delay(delayTimer - 10 * 60 * 1000);
		// 10 mins left
		tellServer('Server Restart in 10 Minutes', 'red');
		logTime(`Server Restart in 10 Minutes`, 'Server-Info');
		await delay(8 * 60 * 1000);
		// 2 minutes left
		tellServer('Server Restart in 2 Minutes', 'red');
		logTime(`Server Restart in 2 Minutes`, 'Server-Info');
		await delay(2 * 60 * 1000);
		restartServer();
	} else {
		await delay(delayTimer);
		restartServer();
	}
}

//
startMinecraftServer();

//
// web server setting
const app = require('express')();
const bodyParser = require('body-parser');
const path = require('path');
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const logger = (request, response, next) => {
	logTime(`requestURL: ${request.url}`, 'Web-Info', request);
	// TODO add login checking
	next();
};

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

app.use(logger);
//

// get post request
app.get('/', (request, response) => {
	response.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/sketch.js', (request, response) => {
	response.sendFile(path.join(__dirname, 'sketch.js'));
});
app.get('/style.css', (request, response) => {
	response.sendFile(path.join(__dirname, 'style.css'));
});
//

app.post('/delay', (request, response) => {
	let delay = request.body.delay;
	logTime(`new Delay Timer updated: ${delay}`, 'Web-Info');
	defaultDelay = delay;
	response.send(JSON.stringify({ msg: 'delay Timer will be updated in next Delay' }));
});

app.post('/command', (request, response) => {
	let command = request.body.command;
	logTime(command, 'Web-Info');
	minecraftServerProcess.stdin.write(`${command}\n`);
	// body: command
	response.send(JSON.stringify({ msg: 'runned command' }));
});

app.post('/restart', (request, response) => {
	if (serverAction) {
		logTime('Restart Request Denied, Server is running another action', 'Web-Info');
		return response.send(JSON.stringify({ msg: 'Restart Request Denied, Server is running another action' }));
	}
	serverAction = true;
	restartServer(request, response);
	serverAction = false;
});

app.post('/stop', (request, response) => {
	if (serverAction) {
		logTime('Stop Request Denied, Server is running another action', 'Web-Info');
		return response.send(JSON.stringify({ msg: 'Stop Request Denied, Server is running another action' }));
	}
	serverAction = true;
	stopServer(request, response);
	serverAction = false;
});

//
app.listen(webServerPort);

//

function logTime(String, type, request = null) {
	let str = `[${Date().split(' ')[4]}] [${type}] ${String}`;
	if (request) {
		str = `[${Date().split(' ')[4]}] [${type}] [IP: ${request.socket.remoteAddress.split(':')[3]}] ${String}`;
	}
	console.log(str);
	return str;
}

async function stopServer(request, response) {
	let delayTime = 0;
	try {
		delayTime = request.body.delay;
	} catch (error) {
		logTime(`delayTime Undefined\n${error}`, 'Server-WARN');
	}
	logTime(`Server Stop in ${delayTime}milisecond`, 'Server-Info');
	await delay(delayTime); // delay 5 second
	logTime(`\n Stopping Server \n`, 'Server-Info');
	minecraftServerProcess.stdin.write('/stop\n');
	response.send(JSON.stringify({ msg: 'Server Stopped' }));
}

async function restartServer(request, response) {
	let delayTime = 0;
	startLogging = false;
	client.channels.cache.get(log_channel_id).send('```\nRestarting Server\n```');
	try {
		delayTime = request.body.delay;
	} catch (error) {
		logTime(`DelayTime Undefined\n${error}`, 'Server-WARN');
	}
	logTime(`\n----Requested Restart in ${delayTime} miliseconds----\n`, 'Server-Info');
	//
	await delay(delayTime);
	//
	logTime(`\n Restarting Server \n`, 'Server-Info');
	//
	minecraftServerProcess.stdin.write('/stop\n');
	//
	// response.writeHead(200, { 'Content-Type': 'text/plain' });
	// response.write(JSON.stringify({ msg: 'Server Stopped' }));
	//
	logTime(`\n Server Stopped \n  Started 10 Seconds Buffer Timer \n`, 'Server-Info');
	client.channels.cache.get(log_channel_id).send('```\n Server Stopped \n  Started 10 Seconds Buffer Timer \n```');
	//
	// response.write(JSON.stringify({ msg: 'Starting 10 Seconds Buffer Timer' }));
	//
	await delay(10000); // delay 10 second
	//
	//
	// response.write(JSON.stringify({ msg: 'Server Starting' }));
	//
	startMinecraftServer();
	//
	// response.end(JSON.stringify({ msg: 'Server Started' }));
	//
}

//
//
//
//
//

const Discord = require('discord.js');
const { token, prefix, bot_id, server_id, chat_channel_id, log_channel_id } = require('./botConfig.json');
const client = new Discord.Client();

client.on('ready', () => {
	//!
	logTime(`Logged in as ${client.user.tag}`, 'DiscordBot-Info');
});

client.on('message', async (message) => {
	// prevent bot command
	if (message.author.bot) return;
	// when receive msg in chat channel
	if (message.channel.id == chat_channel_id) {
		//
		if (message.content[0] == prefix) {
			let msg = message.content.substr(1, message.content.length - 1);
			let command = msg.split(' ')[0].toLowerCase();
			//
			if (command == 'status') {
				let player = msg.split(' ')[1];
				let msgSend = getPlayerStatus(player);
				message.channel.send(msgSend);
				//
				//
			} else if (command == 'list') {
				//
				let playerAry = [];
				for (let i = 0; i < playerList.length; i++) {
					playerAry.push(playerList[i][0]);
				}
				message.channel.send(`There are ${playerList.length} Players\n${playerAry.join(', ')}`);
				//
				//
			} else if (command == 'uptime') {
				//
				let timeStr = getUpTime();
				message.channel.send(`Server has been up for ${timeStr}`);
			} else if (command == 'help') {
				let arg = msg.split(' ')[1];
				if (!arg) {
					message.channel.send(
						`Avaliable Commands: status, list, uptime, runCommand\nUse ${prefix}help <command> to have more info`
					);
				} else if (arg == 'status') {
					message.channel.send(`Return status of a player\nUsage: ${prefix}status <PlayerName / index in player list>`);
				} else if (arg == 'list') {
					message.channel.send(`List the Players in the server`);
				} else if (arg == 'uptime') {
					message.channel.send(`Return Uptime of the Server`);
				} else if (arg == 'runcommand') {
					message.channel.send(`Send Command to the sever\nUsage: ${prefix}runCommand <commandInput>`);
				}
			} else if (command == 'runcommand') {
				if (message.member.roles.cache.some((r) => r.id == commandRole_id) || !commandRoleREQUIRED) {
					let commandInput = message.content.split(' ');
					commandInput.shift();
					minecraftServerProcess.stdin.write(`${commandInput.join(' ')}\n`);
				} else {
					message.channel.send(`Request Denied`);
				}
			} else {
				discordToServerChat(message);
			}
		} else {
			discordToServerChat(message);
		}
	}
});

function findInArray2D(array, targetIndex, target) {
	for (let i = 0; i < array.length; i++) {
		if (array[i][targetIndex] == target) {
			return i;
		}
	}
	return -1;
}

function getPlayerStatus(arg) {
	if (isNaN(arg)) {
		// is a string
		// let index = playerList.indexOf(arg);
		let index = findInArray2D(playerList, 0, arg);
		if (index != -1) {
			let msg = getUpTime(playerList[index][1]);
			return `${playerList[index][0]} has been up for: ${msg}`;
		} else {
			return 'Player not found';
		}
	} else {
		// is index
		if (arg < 0 || arg >= playerList.length) return 'Index out of bound';
		let msg = getUpTime(playerList[arg][1]);
		return `${playerList[arg][0]} has been up for: ${msg}`;
	}
}

function getUpTime(oriTime = startUptime) {
	let nowTime = new Date().getTime();
	let timePass = nowTime - oriTime;
	let seconds = Math.floor(timePass / 1000) % 60;
	let minutes = Math.floor(timePass / (1000 * 60)) % 60;
	let hrs = Math.floor(timePass / (1000 * 60 * 60));
	return `${hrs} hours, ${minutes} minutes, ${seconds} seconds`;
}

function discordToServerChat(messageObj) {
	let text = messageObj.content;
	let author = messageObj.member.displayName;
	let mentionIndexAry = findMentionIndex(text);
	// console.log(mentionIndexAry);
	let displayNameAry = findMentionName(text, mentionIndexAry);
	// console.log(displayNameAry);
	let newText = text;
	for (let i = 0; i < displayNameAry.length; i++) {
		newText = replaceAt(newText, displayNameAry[i][0], displayNameAry[i][1], displayNameAry[i][2]);
	}
	let textToSend = `[${author}] ${newText}`;
	// console.log(textToSend);
	tellServer(textToSend);
}

// if index 33 === '<' => chat message
// if index 33 === '[' command output
// if index 33 - 24 === '[server]' /say command
// [13:30:47] [Server thread/INFO]: GW_MC left the game
function serverChatToDiscord(string) {
	try {
		//! prevent bot sending back to discord;
		if (string[33] === '<') {
			//
			let msg = string.substr(33, string.length - 33);
			let guild = client.guilds.cache.get(server_id);
			client.channels.cache.get(chat_channel_id).send(`[${Date().split(' ')[4]}] ${msg}`);
			//
			// console.log(`[${Date().split(' ')[4]}] ${msg}`);
		} else if (string.search('joined the game') != -1 || string.search('left the game') != -1) {
			let msg = string.substr(33, string.length - 33);
			let guild = client.guilds.cache.get(server_id);
			client.channels.cache.get(chat_channel_id).send(`[${Date().split(' ')[4]}] ${msg}`);
			//
			// console.log(`[${Date().split(' ')[4]}] ${msg}`);
		} else if (findInArray2D(playerList, 0, string.split(' ')[3]) != -1) {
			// [3] is a player name
			if (string.search('has made the') != -1) {
				// has advancement
				let msg = string.substr(33, string.length - 33);
				client.channels.cache.get(chat_channel_id).send(`[${Date().split(' ')[4]}] ${msg}`);
			} else if (isDeathMessage(string.split(' ')[4])) {
				// death message
				let msg = string.substr(33, string.length - 33);
				client.channels.cache.get(chat_channel_id).send(`[${Date().split(' ')[4]}] ${msg}`);
			}
		}
	} catch (err) {
		logTime(error, 'DiscordBot-ERROR');
	}
}

function isDeathMessage(arg) {
	for (let i = 0; i < deathLogArg.length; i++) {
		if (arg == deathLogArg[i]) return true;
	}
	return false;
}

function logServerlog(string) {
	if (string[33] === '<') return;
	if (string.search('logged in with entity id') != -1) {
		let index1 = string.indexOf('[', 33);
		let index2 = string.indexOf(']', 33);
		if (index1 && index2) {
			string = replaceAt(string, ' ', index1, index2);
		}
	}
	try {
		// let guild = client.guilds.cache.find(server_id);
		// console.log(client.channels.cache);
		client.channels.cache.get(log_channel_id).send(string);
	} catch (error) {
		logTime(error, 'DiscordBot-ERROR');
	}
}

function findMentionIndex(text) {
	let indexAry = [];
	let searching = true;
	let startIndex = 0;
	while (searching) {
		let index1 = text.indexOf('<@!', startIndex);
		if (index1 == -1) {
			searching = false;
			continue;
		}
		let index2 = text.indexOf('>', index1);
		if (checkForInteger(text, index1, index2)) {
			indexAry.push([index1, index2]);
		}
		startIndex = index1 + 1;
	}
	return indexAry;
}

function replaceAt(str, replacement, index1, index2) {
	return str.substr(0, index1) + replacement + str.substr(index2 + 1, str.length - index2);
}

// <@12345>
// 01234567
function findMentionName(msg, ary) {
	let guild = client.guilds.cache.get(server_id);
	let displayNameAry = [];
	for (let i = 0; i < ary.length; i++) {
		let index1 = ary[i][0] + 3;
		let length = ary[i][1] - index1;
		let id = msg.substr(index1, length);
		let user = guild.members.cache.get(id);
		displayNameAry.push([user.displayName, ary[i][0], ary[i][1]]);
	}
	return displayNameAry;
}

function checkForInteger(text, index1, index2) {
	let allInt = true;
	if (index2 - index1 === 1) return false;
	for (let i = index1 + 3; i < index2; i++) {
		if (isNaN(text[i])) {
			allInt = false;
			return false;
		}
	}
	return true;
}
client.login(token).then((token) => {
	updatePressence();
});

// {game: {name: `(${botconfig.prefix}) for Brain Central`}, type: "WATCHING"}
function updatePressence() {
	client.user.setPresence({ game: { name: `${prefix}help for more help` }, status: 'online', type: 'WATCHING' });
}
