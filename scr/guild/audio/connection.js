const { consoleLogFormator } = require('../../console/consoleLogFormator');
const { server_getGuild } = require('../management/serverGetGuild');
const { checkAuthorInChannel } = require('../management/checkAuthorInChannel');
const { getAuthorVCchannel } = require('../management/getVoiceChannel');
// //
// function player_ConnectFunction(client, message) {
// 	let guildObj = server_getGuild(client, message);
// 	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
// 	if (code == 11) return message.channel.send('Please wait until the queue ended');
// 	if (code == 10) return message.channel.send('Please enter a Voice channel');
// 	consoleLogFormator(`Trying to Connect VCchannel ID: ${authorVC.id} at ${guildObj.id}`);
// 	//! connect to author channel
// 	guildObj.player.connect(message, authorVC);
// }

// function player_DisconnectFunction(client, message) {
// 	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
// 	if (code == 20) return message.channel.send('I am not in a Voice Channel');
// 	if (code == 10) return message.channel.send('You are not in the same Voice Channel');
// 	let guildObj = server_getGuild(client, message);
// 	consoleLogFormator(`Trying to Connect VCchannel ID: ${clientVC.id} at ${guildObj.id}`);
// 	//! disconenct
// 	guildObj.player.disconnect();
// }
/**
 * Connect to the message author channel
 * @param {object} client client Object
 * @param {object} message message Object
 * @return {boolean} true if the connection was successful
 */
function audio_Connect(client, message) {
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 10) {
		message.channel.send('Please enter a Voice channel');
		return false;
	}
	if (code == 11) {
		message.channel.send('Please wait until the queue ended');
		return false;
	}
	let guildObj = server_getGuild(client, message);
	consoleLogFormator(`Trying to connect voice channel ID: ${authorVC.id} at ${guildObj.id}`);
	guildObj.player.connect(message, authorVC);
	return true;
}

/**
 * disconnect from the message author channel
 * @param {object} client client Object
 * @param {object} message message Object
 * @return {boolean} true if the disconnection was successful
 */
function audio_Disconnect(client, message) {
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 20) {
		message.channel.send('I am not in a Voice Channel');
		return false;
	}
	if (code == 10) {
		message.channel.send('You are not in the same Voice Channel');
		return false;
	}
	let guildObj = server_getGuild(client, message);
	consoleLogFormator(`Trying to disconnect voice channel ID: ${authorVC.id} at ${guildObj.id}`);
	guildObj.player.disconnect(message, authorVC);
	return true;
}

//
// Export
module.exports = {
	audio_Connect,
	audio_Disconnect,
};
