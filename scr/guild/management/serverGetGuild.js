const { server_createDict } = require('./serverCreateDict.js');
//
function server_getGuild(client, message) {
	let guildId = message.guildId;
	if (serverDict.hasOwnProperty(guildId)) {
		return serverDict[guildId];
	} else {
		serverDict[guildId] = server_createDict(client, message);
		return serverDict[guildId];
	}
}
//
// Export
module.exports = server_getGuild;
