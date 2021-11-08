const { server_getGuild } = require('./../management/serverGetGuild');
/**
 * send a help message to the channel
 * @param {client} client client object
 * @param {message} message message object
 * @param {serversDict} serversDict serversDict object
 * @returns
 */
function helpMessage(client, message, serversDict) {
	let helpWebUrl = 'https://github.com/GWMCwing/AuditBot/blob/master/docs/helpList.md';
	let prefixServer = server_getGuild(client, message, serversDict).prefix;
	let msg = 'This guild uses **' + prefixServer + '** as prefix\n';
	msg += `Please visit the below website for complete command list: ${helpWebUrl}`;
	return message.channel.send(msg);
}

module.exports = { helpMessage };
