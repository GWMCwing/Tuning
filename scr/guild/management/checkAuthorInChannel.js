const { getAuthorVCchannel, getClientVCchannel } = require('./getVoiceChannel.js');
const { server_getGuild } = require('./serverGetGuild.js');
//
/**
 *
 * Get the voice channel of the author, client, and status code
 *
 * Code:
 *
 * 0 => allow
 *
 * 10 => Author not in Voice channel
 *
 * 11 => Author not in same voice channel as client && urlList > 0
 *
 * 20 => Client not in Voice channel
 * @param {object} client
 * @param {object} message
 * @return {(code:number,authorVoiceChannel:object,clientVoiceChannel:object)[]} [code, authorVoiceChannel, clientVoiceChannel]
 */
function checkAuthorInChannel(client, message) {
	let authorVC = getAuthorVCchannel(client, message);
	let clientVC = getClientVCchannel(client, message);
	if (!authorVC) return [10, authorVC, clientVC];
	else if (!clientVC) return [20, authorVC, clientVC];
	else if (authorVC != clientVC && server_getGuild(client, message).player.urlList.length != 0)
		return [11, authorVC, clientVC];
	return [0, authorVC, clientVC];
}

//
// Export
module.exports = { checkAuthorInChannel };
