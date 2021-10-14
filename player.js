class PlayerObj {
	constructor(
		guildClass,
		_ytdl,
		_joinVoiceChannel,
		_getVoiceConnection,
		_createAudioPlayer,
		_createAudioResource,
		_AudioPlayerStatus,
		_StreamType
	) {
		this._ytdl = _ytdl;
		//
		this._joinVoiceChannel = _joinVoiceChannel;
		this._getVoiceConnection = _getVoiceConnection;
		//
		this._createAudioPlayer = _createAudioPlayer;
		this._createAudioResource = _createAudioResource;
		this._AudioPlayerStatus = _AudioPlayerStatus;
		this._StreamType = _StreamType;
		//
		this.guildClass = guildClass;
		this.connection = undefined;
		this.subscription = undefined;
		//
		this.currentResource = undefined;
		this.urlList = [];
		//
		this.loopSongBool = false;
		this.loopQueueBool = false;
		this.idleTime = false;
		//
		this.init();
	}
	init() {
		this.player = this._createAudioPlayer();
		this.player.on(this._AudioPlayerStatus.Buffering, () => {
			this.playNextSong();
		});
	}
	disconnect() {
		if (this.player) {
			this.player.stop();
			this.player = undefined;
			this.subscription.unsubscribe();
			this.subscription = undefined;
		}

		if (this.connection) {
			this.connection.destroy();
			this.connection = undefined;
		}
	}
	connect(channel) {
		this.connection = this._joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});
		this.subscription = this.connection.subscribe(this.player);
	}
	getConnection() {
		//
		return this._getVoiceConnection(this.guildClass.id);
	}
	updateConnection(connection = null) {
		this.connection = this.getConnection();
	}
	async idleTimeout() {
		setTimeout(() => {
			if (this.playlists.length > 0) {
				this.disconnect();
			} else {
				this.idleTimer = false;
			}
		}, 5 * 1000 * 60);
	}
	//TODO Testing
	getAudioStream() {
		let url = this.urlList[0];
		return this._ytdl(url);
	}
	playNextSong() {
		if (this.urlList.length == 0) {
			if (this.idleTime) return;
			this.idleTimer = true;
			this.idleTimeout();
			return;
		}
		let audioStream = this.getAudioStream();
		//? which format
		this.currentResource = this._createAudioResource(audioStream, { inputType: this._StreamType.WebmOpus });
		this.player.play(this.currentResource);
	}
	//
	getYTurlID(url) {
		let listStr = 'list=';
		let watchStr = 'watch=';
		let listIndex = url.search(listStr);
		let watchIndex = url.search(watchStr);
		let id = null;
		let type = null;
		if (listIndex != -1) {
			let idIndex_start = listIndex + listStr.length;
			let idIndex_end = url.slice(idIndex_start).search('&');
			id = url.slice(idIndex_start, idIndex_end);
			type = 'listId';
		} else if (watchIndex != -1) {
			let idIndex_start = watchIndex + watchStr.length;
			let idIndex_end = url.slice(idIndex_start).search('&');
			id = url.slice(idIndex_start, idIndex_end);
			type = 'videoId';
		}
		console.log([type, id]);
		return [type, id];
	}

	async addSong(yt_search, string) {
		let result = await yt_search(string);
		let type, id;
		// console.log();
		// console.log(result.all);
		// console.log();
		if (!result.all.length) {
			[type, id] = this.getYTurlID(string);
			let opt = {};
			opt[type] = id;
			result = await yt_search(opt);
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
				if (count == result.videos.length) {
					return false;
				}
			}
		} else {
			if (result.playlists.length) {
				//
				let count = 0;
				for (let x in result.videos) {
					// console.log(x);
					let opt = { videoId: x.videoId };
					let tempResult = await yt_search(opt);
					if (tempResult != 'video unavailable') {
						this.urlList.append(tempResult.url);
					} else {
						count++;
					}
				}
				if (count == result.playlists.length) {
					return false;
				}
			}
			// else if (result.live.length) {
			// 	//
			// }
			else if (result.videos.length) {
				//
				this.urlList.push(result.videos[0].url);
			} else {
				return false;
			}
		}
		return true;
	}
	//* TODO
	seek(time) {
		return false;
	}
	pause() {
		//
		this.player.pause();
	}
	resume() {
		//
		this.player.unpause();
	}
	//TODO
	skip() {
		//* loopQueue
		//* no loop
	}
	//
	removeFromList(index) {
		this.playlists.splice(index);
	}
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
