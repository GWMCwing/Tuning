// const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { TOKEN, PREFIX } = require('./config.json');
//
const { consoleLogFormator } = require('./scr/console/consoleLogFormator');
const { server_getGuild } = require('./scr/guild/management/serverGetGuild');
const { helpMessage } = require('./scr/guild/message/helpMessage');
const { commandHandler } = require('./scr/commandHandler');
//
// console.log('runing');
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES,
		// Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
});

client.once('ready', () => {
	consoleLogFormator('Ready!', true);
	// console.log('ready');
});

var serverDict = {};

client.on('messageCreate', async (message) => {
	if (message.author.bot) return;
	if (message.channel.type === 'dm') return;
	let guildObj = server_getGuild(client, message, serverDict);
	// handle mentioning the bot
	if (handleHelpMessage(client, message, serverDict)) return;
	//
	if (handleMessageCommand(client, message, serverDict, guildObj)) return;
});

//
/**
 * parse the message and send the arguments to the command handler
 *
 * @param {object} client client object
 * @param {object} message message object
 * @param {object} serverDict serverDict object
 * @param {object} guildObj guild object
 * @returns
 */
function handleMessageCommand(client, message, serverDict, guildObj) {
	let guildPrefix = guildObj.prefix;
	if (message.content.startsWith(guildPrefix)) {
		//TODO strip first command
		let command = message.content.split(' ')[0].slice(guildPrefix.length).toLowerCase().trimEnd();
		//
		let args = message.content.split(' ').slice(1);
		try {
			commandHandler(client, message, guildObj, command, args);
		} catch (error) {
			consoleLogFormator(`Error occured\n     message: ${message}`, true);
			console.log(error);
		}
		return true;
	}
	return false;
}

/**
 * parse the message and send help command if needed
 *
 * @param {object} client
 * @param {object} message
 * @param {object} serverDict
 * @returns
 */

function handleHelpMessage(client, message, serverDict) {
	let messageMentions = message.mentions.members;
	if (
		messageMentions.size != 0 &&
		messageMentions.first().id === client.user.id &&
		message.content.search('help') !== -1
	) {
		helpMessage(client, message, serverDict);
		return true;
	}
	return false;
}

//
//
client.login(TOKEN);
