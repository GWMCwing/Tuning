const ytdl = require('ytdl-core');
const { consoleLogFormator } = require('./../console/consoleLogFormator');
//
/**
 *
 * @param {string} url string of url
 * @param {number} seekTime number of seconds to seek
 * @return {ytdl.Stream} stream of audio from ytdl
 */
async function getAudioStream(url, seekTime = 0) {
	return await ytdl(url, {
		filter: 'audioonly',
		quality: 'highestaudio',
		begin: `${seekTime}s`,
		highWaterMark: 1 << 25,
	}).on('error', (err) => {
		consoleLogFormator(err, true);
	});
}

//
module.exports = { getAudioStream };
