const { PREFIX } = require('./../../../config.json');
const { PlayerObj } = require('./../../player/playerClass');
class serverClass {
	constructor(serverId) {
		this.id = serverId;
		this.prefix = PREFIX;
		this.connection = undefined;
		this.player = new PlayerObj(
			this,
			ytdl,
			joinVoiceChannel,
			getVoiceConnection,
			createAudioPlayer,
			createAudioResource,
			AudioPlayerStatus,
			StreamType
		);
	}
}
//
// Export
module.exports = serverClass;
