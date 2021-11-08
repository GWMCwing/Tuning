const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
//
/**
 * connect to voice channel
 * @param {PlayerObj} playerObj player object
 * @param {message} message message object
 * @param {VoiceChannel} channel Voice channel Object
 */
async function player_connect(playerObj, message, channel) {
	if (!playerObj.player) await playerObj.init();
	playerObj.connection = await joinVoiceChannel({
		channelId: channel.id,
		guildId: message.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	});
	playerObj.subscription = playerObj.connection.subscribe(playerObj);
	//TODO Timeout
}
//
/**
 * disconnect from voice channel
 * @param {PlayerObj} playerObj player object
 */
function player_disconnect(playerObj) {
	if (playerObj.player) {
		playerObj.player.stop();
		playerObj.player = null;
		playerObj.subscription.unsubscribe();
		playerObj.subscription = null;
	}
	if (playerObj.connection) {
		playerObj.connection.destroy();
		playerObj.connection = null;
	}
	playerObj.resetStatus();
}

/**
 *
 * @param {PlayerObj} playerObj player object
 * @returns {VoiceConnection} voice connection
 */
function player_getConnection(playerObj) {
	return getVoiceConnection(playerObj.guildObj.id);
}
//* may remove
function player_updateConnection(playerObj, connection = null) {
	playerObj.connection = getConnection(playerObj);
}

module.exports = { player_connect, player_disconnect, player_getConnection, player_updateConnection };
