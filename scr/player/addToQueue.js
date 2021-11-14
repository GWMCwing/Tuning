const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { playNextIfEnd } = require('./playAudio');
//TODO Create Erro class for sending erro feedback to client
// const argsMissingError = new Error('Missing arguments');
/**
 *
 * @param {object} client
 * @param {object} message
 * @param {string[]} args
 * @param {object} guildObj
 */
async function addToQueue(client, message, args, guildObj) {
	//! what if the args is not a url
	//!
	if (args.length() == 0) {
		message.channel.send('Missing arguments');
		return;
	}
	//
	url = args.join(' ').trimEnd();
	if (!ytdl.validateURL(url)) {
		// TODO get first video in search and assign it to url
		url = await searchOnYT(message, url);
		if (!url) {
			return false;
		}
	}
	//
	let videoInfo = await getInfoFromUrl(url);
	if (!videoInfo) {
		message.channel.send('Unable to fetch URL');
		return false;
	}
	guildObj.player.addUrl(url, videoInfo);
	playNextIfEnd(guildObj);
	return true;
}

async function searchOnYT(message, string) {
	let result = await ytSearch(string);
	//TODO choose video by user
	// let videos = result.videos.slice(0,3);
	if (videos.length == 0) {
		return false;
	}
	let video = result.videos[0];
	if (!video) return false;
	return video.url;
}

async function getInfoFromUrl(url) {
	let videoInfo = null;
	for (let i = 0; i < 3; i++) {
		videoInfo = await ytdl.getInfo(url).catch((err) => {
			console.log(err);
			return null;
		});
		if (videoInfo != null) break;
		await setTimeout(() => {}, 500);
	}
	return videoInfo;
}

//
//Export
module.exports = { addToQueue };
