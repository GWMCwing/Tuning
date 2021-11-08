const { server_createGuildObj } = require('./serverCreateDict.js');
//
/**
 * get guild object from server object
 * @param {object} client client object
 * @param {object} message message object
 * @param {serversObj} serversObj servers object
 * @returns {guildObj} guild object
 */
function server_getGuild(client, message, serversDict) {
	let guildId = message.guildId;
	if (serversDict.hasOwnProperty(guildId)) {
		return serversDict[guildId];
	} else {
		serversDict[guildId] = server_createGuildObj(client, message);
		return serversDict[guildId];
	}
}
//
// Export
module.exports = { server_getGuild };
