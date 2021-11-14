const { server_getGuild } = require('./serverGetGuild');
const { PREFIX } = require('./../../../config.json');
//
function server_ResetPrefix(client, message) {
	let guildObj = server_getGuild(client, message);
	guildObj.prefix = PREFIX;
	message.channel.send(`New Prefix: ${guildObj.prefix}`);
}
function server_ChangePrefix(client, message) {
	let guildObj = server_getGuild(client, message);
	guildObj.prefix = message.content.split(' ')[1];
	message.channel.send(`New Prefix: ${guildObj.prefix}`);
}

//
// Export
module.exports = {
	server_ResetPrefix,
	server_ChangePrefix,
};
