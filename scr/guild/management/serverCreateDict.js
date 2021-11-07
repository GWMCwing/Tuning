const { consoleLogFormator } = require('./../../console/consoleLogFormator');
const { serverClass } = require('./serverClass');
//
function server_createDict(client, message) {
	consoleLogFormator('creating guild Object id: ' + message.guildId);
	let tempobj = new serverClass(message.guildId);
	return tempobj;
}
//
// Export
module.exports = server_createDict;
