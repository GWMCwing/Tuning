const { PREFIX } = require('../../../config.json');
const { PlayerObj } = require('../../player/playerClass');
class guildClass {
	constructor(serverId) {
		this.id = serverId;
		this.prefix = PREFIX;
		this.connection = undefined;
		this.player = new PlayerObj(this);
	}
}
//
// Export
module.exports = { guildClass };
