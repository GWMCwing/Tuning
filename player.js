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
	playIfStopped() {}

	//
	getYTurlID(url) {
		let listStr = 'list=';
		let watchStr = 'watch=';
		let listIndex = url.search(listStr);
		let watchIndex = url.search(watchStr);
		let id = null;
		let type = null;
		if (listIndex != -1) {
			let idIndex_start = listIndex + listStr.length();
			let idIndex_end = url.slice(idIndex_start).search('&');
			id = url.slice(idIndex_start, idIndex_end);
			type = 'listId';
		} else if (watchIndex != -1) {
			let idIndex_start = watchIndex + watchStr.length();
			let idIndex_end = url.slice(idIndex_start).search('&');
			id = url.slice(idIndex_start, idIndex_end);
			type = 'videoId';
		}
		return [type, id];
	}

	async addSong(yt_search, string) {
		let result = await yt_search(string);
		let type, id;
		if (!result.all.length()) {
			[type, id] = this.getYTurlID(string);
			let opt = {};
			opt[type] = id;
			result = await yt_search(opt);
		}
		if (type == 'videoId') {
			this.urlList.append(result.url);
		} else if (type == 'listId') {
			let count = 0;
			for (let x in result.videos) {
				let opt = { videoId: x.videoId };
				let tempResult = await yt_search(opt);
				if (tempResult != 'video unavailable') {
					this.urlList.append(tempResult.url);
				} else {
					count++;
				}
			}
			if (count == result.videos.length()) {
				return false;
			}
		} else {
			if (result.playlists.length()) {
				//
				let count = 0;
				for (let x in result.videos) {
					let opt = { videoId: x.videoId };
					let tempResult = await yt_search(opt);
					if (tempResult != 'video unavailable') {
						this.urlList.append(tempResult.url);
					} else {
						count++;
					}
				}
				if (count == result.playlists.length()) {
					return false;
				}
			}
			// else if (result.live.length()) {
			// 	//
			// }
			else if (result.videos.length()) {
				//
				for (let x in result.videos) {
					this.urlList.append(x.url);
				}
			} else {
				return false;
			}
		}
		return true;
	}
	//
	seek(time) {
		return false;
	}
	pause() {}
	resume() {}
	//
	skip() {}
	//
	removeFromList(index) {}
	//
	loopSong() {
		if (!this.loopSongBool) {
			this.loopQueueBool = false;
		}
		this.loopSongBool = !this.loopSongBool;
	}
	loopQueue() {
		if (!this.loopQueueBool) {
			this.loopSongBool = false;
		}
		this.loopQueueBool = !this.loopQueueBool;
	}
}
module.exports = { PlayerObj };
