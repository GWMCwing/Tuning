const { PREFIX } = require('../../../config.json');
const { PlayerObj } = require('../../player/playerClass');
/**
 * @type {guildObj}
 * @param {string} serverId
 */
class guildClass {
	constructor(guildId) {
		this.id = guildId;
		this.prefix = PREFIX;
		this.connection = undefined;
		this.player = new PlayerObj(this);
	}
}
//
// Export
module.exports = { guildClass };
