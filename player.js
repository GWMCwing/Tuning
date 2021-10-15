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
		this.player = undefined;
		this.currentResource = undefined;
		this.urlList = [];
		//
		this.loopSongBool = false;
		this.loopQueueBool = false;
		this.idleTime = false;
		//
		this.init();
	}
	async init() {
		this.player = await this._createAudioPlayer();
		this.player.on(this._AudioPlayerStatus.Idle, () => {
			this.playNextSongifEnd();
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
		this.urlList = [];
	}
	async connect(channel) {
		this.connection = await this._joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});
		if (!this.player) {
			await this.init();
		}
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
		console.log('idleTimeout');
		setTimeout(() => {
			if (this.urlList.length == 0) {
				this.disconnect();
			} else {
				this.idleTimer = false;
			}
		}, 5 * 1000 * 60);
	}
	//TODO Testing
	async getAudioStream(seekTime = 0) {
		let url = this.urlList[0];
		return await this._ytdl(url, {
			quality: 'highestaudio',
			filter: 'audioonly',
			begin: `${seekTime}s`,
			// highWaterMark: 1 << 25,
		});
	}
	async playNextSong() {
		if (this.urlList.length == 0) {
			this.idleTimer = true;
			this.idleTimeout();
			return;
		}
		this.idleTimer = false;
		let audioStream = await this.getAudioStream();
		//? which format
		this.currentResource = this._createAudioResource(audioStream, { inputType: this._StreamType.Opus });
		this.player.play(this.currentResource);
		this.subscription = this.connection.subscribe(this.player);
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
	getState() {
		if (this.player) return this.player.checkPlayable();
	}
	//TODO testing for empty return
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
				let playList = result.playlists[0];
				for (let x in playList.videos) {
					console.log(x);
					let opt = { videoId: x.videoId };
					console.log(opt);
					let tempResult = await yt_search(opt);
					if (tempResult != 'video unavailable') {
						this.urlList.append(tempResult.url);
					} else {
						count++;
					}
				}
				if (count == playList.length) {
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
		// console.log(`ended`);
		// this.playNextSongifEnd();
		return true;
	}
	playNextSongifEnd(force = false) {
		console.log(`playerState: ${this.player.checkPlayable()}`);
		if ((this.currentResource && this.currentResource.ended) || force) {
			console.log(`currentResource: ${this.currentResource.ended}`);
			this.player.stop();
			// this.player = undefined;
			this.subscription.unsubscribe();
			this.subscription = undefined;

			if (!(this.loopSongBool || this.loopQueueBool)) {
				this.urlList.shift();
			}
		}
		if (!this.player.checkPlayable()) {
			this.playNextSong();
		}
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
		if (this.loopQueueBool) {
			this.urlList.push(this.urlList[0]);
			this.urlList.shift();
			this.playNextSongifEnd(true);
		} else {
			this.urlList.shift();
			this.playNextSongifEnd(true);
		}
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
