class PlayerObj {
	constructor() {
		this.player = undefined;
		//
		this.urlList = [];
		//
		this.loopSongBool = false;
		this.loopQueueBool = false;
		//
	}
	playSong() {}
	addUrl(url) {}
	urlChecker(url) {
		return 'unknown';
	}
	seek(time) {
		return false;
	}
	pause() {}
	resume() {}
	skip() {}
	loopSong() {}
	loopQueue() {}
}
module.exports = { PlayerObj };
