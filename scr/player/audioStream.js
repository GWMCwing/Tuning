const ytdl = require('ytdl-core');
const { consoleLogFormator } = require('./../console/consoleLogFormator');
//
/**
 *
 * @param {object} ytdlInfo ytdlInfo object
 * @param {number} seekTime number of seconds to seek
 * @return {ReadableStream} stream of audio from ytdl
 */
async function getAudioStream(ytdlInfo, seekTime = 0) {
	return await ytdl
		.downloadFromInfo(ytdlInfo, {
			filter: 'audioonly',
			quality: 'highestaudio',
			begin: `${seekTime}s`,
			highWaterMark: 1 << 25,
		})
		.on('error', (err) => {
			consoleLogFormator(err, true);
		});
}

//
// Export
module.exports = { getAudioStream };
