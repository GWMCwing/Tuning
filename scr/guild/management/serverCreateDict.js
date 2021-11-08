const { consoleLogFormator } = require('./../../console/consoleLogFormator');
const { guildClass } = require('./guildClass');
//
/**
 * create server object
 * @param {client} client client object
 * @param {message} message message object
 * @returns {guildObj} guildobj object
 */
function server_createGuildObj(client, message) {
	consoleLogFormator('creating guild Object id: ' + message.guildId);
	let guildobj = new guildClass(message.guildId);
	return guildobj;
}
//
// Export
module.exports = { server_createGuildObj };
