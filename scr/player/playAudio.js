const { getAudioStream } = require('./audioStream');
const { createAudioResource } = require('@discordjs/voice');
const { consoleLogFormator } = require('./../console/consoleLogFormator');
//
/**
 *
 * @param {PlayerObj} playerObj a player object
 * @param {number} seekTime a number in seconds
 * @return {boolean} true if player subscription is valid, false if no url in playerObj.urlList
 */
async function player_playAudio(playerObj, seekTime = 0) {
	if (!playerObj.urlList.length) {
		consoleLogFormator('No url to play');
		return false;
	}
	if (!playerObj.player) playerObj.init();
	//
	let url = playerObj.urlList[playerObj.currentSongIndex];
	let audioStream = await getAudioStream(url, seekTime);
	//
	playerObj.audioResource = await createAudioResource(audioStream, { inlineVolume: true });
	playerObj.audioResource.setVolume(playerObj.volume);
	playerObj.player.play(playerObj.audioResource);
	// set error catcher
	//* https://github.com/fent/node-ytdl-core/issues/932
	const funcao = audioStream.listeners('error')[2];
	audioStream.removeListener('error', funcao);
	audioStream.on('error', (err) => {
		try {
			throw new Error();
		} catch {
			audioStream.destroy();
			consoleLogFormator(err);
			setTimeout(() => {
				player_playAudio(playerObj, seekTime);
			}, 1000);
		}
	});
	//
	playerObj.subscription = playerObj.connection.subscribe(playerObj.player);
	return true;
}

//
// Export
module.exports = { player_playAudio };