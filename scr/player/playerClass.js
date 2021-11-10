//
const { createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');

class PlayerObj {
	constructor(guildObj) {
		this.guildObj = guildObj;
		this.urlList = [];
		this.pause = false;
		this.volume = 0.3;
		//
		this.connection = null;
		this.player = null;
		this.currentStream = null;
		this.subscription = null;
		//
		this.currentSongIndex = -1;
		//
		this.loopSongBool = false;
		this.loopQueueBool = false;
		this.shuffleBool = false;
		//
		this.idleTime = false;
		//
		this.init();
	}
	async init() {
		this.player = await createAudioPlayer();
		this.player.on(AudioPlayerStatus.Idle, () => {
			//TODO Play Next Song If End
		});
	}
	resetStatus() {
		this.urlList = [];
		this.pause = false;
		//
		this.currentSong = null;
		this.currentSongIndex = -1;
		this.currentSongTime = null;
		this.currentSongDuration = null;
		//
		this.loopSongBool = false;
		this.loopQueueBool = false;
		this.shuffleBool = false;
		this.idleTime = false;
	}
}

//
// Export
module.exports = { PlayerObj };
