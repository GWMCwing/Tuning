const { server_getGuild } = require('./../management/serverGetGuild');
function helpMessage(client, message) {
	let helpWebUrl = 'https://github.com/GWMCwing/AuditBot/blob/master/docs/helpList.md';
	let prefixServer = server_getGuild(client, message).prefix;
	let msg = 'This guild uses **' + prefixServer + '** as prefix\n';
	msg += `Please visit the below website for complete command list: ${helpWebUrl}`;
	return message.channel.send(msg);
}

module.exports = helpMessage;
