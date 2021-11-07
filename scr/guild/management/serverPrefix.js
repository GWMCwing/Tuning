const { server_getGuild } = require('./serverGetGuild');
const { PREFIX } = require('./../../../config.json');
//
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
//
//
module.exports = {
	server_ResetPrefixFunction,
	server_ChangePrefixFunction,
};
