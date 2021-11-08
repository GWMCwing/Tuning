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
		this.latestMessage = undefined;
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
			this.playNextSongifEnd(this.latestMessage);
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
		this.loopQueueBool = false;
		this.loopSongBool = false;
		this.urlList = [];
	}
	async connect(message, channel) {
		this.connection = await this._joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});
		if (!this.player) {
			await this.init();
		}
		this.subscription = this.connection.subscribe(this.player);
		this.idleTimeout(message, 10 * 1000 * 60, true);
	}
	getConnection() {
		//
		return this._getVoiceConnection(this.guildClass.id);
	}
	updateConnection(connection = null) {
		this.connection = this.getConnection();
	}
	//? not a stand along function
	async idleTimeout(message, time = 5 * 1000 * 60, repeat = false) {
		setTimeout(() => {
			if (this.urlList.length == 0) {
				this.loopQueueBool = false;
				this.loopSongBool = false;
				try {
					if (message.guild.me.voice.channel) {
						message.channel.send('Disconnected due to Inactivity');
						this.disconnect();
					}
				} catch (error) {}
			} else {
				this.idleTimer = false;
				if (repeat) this.idleTimeout(message, time, repeat);
			}
		}, time);
	}
	async getAudioStream(seekTime = 0) {
		let url = this.urlList[0][0];
		return await this._ytdl(url, {
			// quality: 'highestaudio',
			filter: 'audioonly',
			begin: `${seekTime}s`,
			highWaterMark: 1 << 25,
		});
	}
	async playNextSong(message = null, seekTime = 0) {
		if (this.urlList.length == 0) {
			this.idleTimer = true;
			return;
		}
		this.idleTimer = false;
		let audioStream = await this.getAudioStream(seekTime);
		//? which format
		this.currentResource = this._createAudioResource(audioStream, {
			// inputType: this._StreamType.Opus,
			inlineVolume: true,
		});
		this.currentResource.volume.setVolume(0.3);
		this.player.play(this.currentResource);
		//https://github.com/fent/node-ytdl-core/issues/932
		const funcao = audioStream.listeners('error')[2];
		audioStream.removeListener('error', funcao);
		audioStream.on('error', (err) => {
			try {
				throw new Error();
			} catch {
				audioStream.destroy();
				console.log(err);
				if (message) message.channel.send('Restart Due to Crashes');
				setTimeout(this.playNextSongifEnd(message, true, 1), 500); // restart after 50 seconds
			}
		});

		//
		this.subscription = this.connection.subscribe(this.player);
		if (!seekTime && message) message.channel.send('now playing: ``` ' + this.urlList[0][1] + ' ```');
	}
	//
	getYTurlID(url) {
		// console.log(url);

		let listStr = 'list=';
		let watchStr = 'watch=';
		let watchStr2 = 'watch?v=';
		let listIndex = url.search(listStr);
		let watchIndex = url.search(watchStr);
		let watchIndex2 = url.search('watch');
		let Vindex = url.search('v=');
		if (watchIndex2 == -1 || Vindex == -1) {
			watchIndex2 = -1;
		}

		// console.log(`index=  ${listIndex}, ${watchIndex}, ${watchIndex2} `);
		let id = null;
		let type = null;
		if (listIndex != -1) {
			let idIndex_start = listIndex + listStr.length;
			let idIndex_end = url.slice(idIndex_start).search('&');
			if (idIndex_end === -1) {
				idIndex_end = idIndex_start + url.slice(idIndex_start).length + 1;
			} else {
				idIndex_end = idIndex_start + idIndex_end + 1;
			}
			// console.log(idIndex_start, idIndex_end);
			id = url.slice(idIndex_start, idIndex_end);
			type = 'listId';
		} else if (watchIndex != -1) {
			let idIndex_start = watchIndex + watchStr.length;
			let idIndex_end = url.slice(idIndex_start).search('&');
			if (idIndex_end === -1) {
				idIndex_end = idIndex_start + url.slice(idIndex_start).length + 1;
			} else {
				idIndex_end = idIndex_start + idIndex_end + 1;
			}
			id = url.slice(idIndex_start, idIndex_end);
			type = 'videoId';
		} else if (watchIndex2 != -1) {
			let idIndex_start = watchIndex2 + watchStr2.length;
			let idIndex_end = url.slice(idIndex_start).search('&');
			if (idIndex_end === -1) {
				idIndex_end = idIndex_start + url.slice(idIndex_start).length + 1;
			} else {
				idIndex_end = idIndex_start + idIndex_end + 1;
			}
			id = url.slice(idIndex_start, idIndex_end);
			type = 'videoId';
		}
		// console.log([type, id]);
		return [type, id];
	}
	getState() {
		if (this.player) return this.player.checkPlayable();
	}
	//TODO testing for empty return
	async addSong(yt_search, string, message) {
		let result;
		let [type, id] = this.getYTurlID(string);
		if (type) {
			let opt = {};
			opt[type] = id;
			try {
				result = await yt_search(opt);
			} catch (error) {
				return message.channel.send(`${error}`);
			}
			if (type == 'videoId') {
				this.urlList.push([result.url, result.title]);
			} else if (type == 'listId') {
				let count = 0;
				for (let i = 0; i < result.videos.length; i++) {
					let video = result.videos[i];
					let opt = {};
					opt.videoId = video.videoId;
					let tempResult = await yt_search(opt);
					if (tempResult != 'video unavailable') {
						this.urlList.push([tempResult.url, tempResult.title]);
					} else {
						count++;
					}
				}
				if (count == result.videos.length) {
					return message.channel.send('All songs in playlist are unavaliable');
				}
			}
			return true;
		} else {
			result = await yt_search(string);
			if (result.videos.length) {
				//
				this.urlList.push([result.videos[0].url, result.videos[0].title]);
				return true;
			} else {
				return false;
			}
		}
		message.channel.send(`error occured`);
		return true;
	}
	playNextSongifEnd(message = null, force = false, seekTime = 0) {
		// console.log(`playerState: ${this.player.checkPlayable()}`);
		if (message) this.latestMessage = message;
		if ((this.currentResource && this.currentResource.ended) || force) {
			// console.log(`currentResource: ${this.currentResource.ended}`);
			this.player.stop();
			// this.player = undefined;
			// this.subscription.unsubscribe();
			// this.subscription = undefined;
			if (!seekTime) {
				if (this.loopQueueBool) this.urlList.push(this.urlList[0]);
				if (!this.loopSongBool) this.urlList.shift();
			}
		}
		if (this.urlList.length == 0) return (this.currentResource = undefined);
		if (!this.player.checkPlayable()) {
			this.playNextSong(this.latestMessage, seekTime);
		}
	}
	//* TODO
	seek(message, seekTime) {
		this.player.stop();
		this.playNextSong(message, seekTime);
		return true;
	}
	pause() {
		//
		this.player.pause();
	}
	resume() {
		//
		this.player.unpause();
	}
	clear() {
		this.urlList = [];
		this.playNextSongifEnd(null, true);
	}
	skip() {
		//* loopQueue
		if (this.loopQueueBool) {
			this.urlList.push(this.urlList[0]);
			this.urlList.shift();
			this.playNextSongifEnd(null, true);
		} else {
			this.urlList.shift();
			this.playNextSongifEnd(null, true);
		}
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
