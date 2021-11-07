const { getAuthorVCchannelFunction, getClientVCchannelFunction } = require('./getVoiceChannel.js');
//
/**
 *
 * Code: 0 => allow
 * 		 10 => Author not in Voice channel
 * 		 11 => Author not in same voice channel as client && urlList > 0
 * 		 20 => Client not in Voice channel
 * @param {client} client
 * @param {message} message
 * @returns
 */
function checkAuthorInChannel(client, message) {
	let authorVC = getAuthorVCchannelFunction(client, message);
	let clientVC = getClientVCchannelFunction(client, message);
	if (!authorVC) return [10, authorVC, clientVC];
	else if (!clientVC) return [20, authorVC, clientVC];
	else if (authorVC != clientVC && server_getGuild(client, message).player.urlList.length != 0)
		return [11, authorVC, clientVC];
	return [0, authorVC, clientVC];
}

module.exports = { checkAuthorInChannel };
