class PlayerObj {
	constructor(playerStream) {
		this.player = playerStream;
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
