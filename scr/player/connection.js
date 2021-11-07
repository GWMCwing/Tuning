const { consoleLogFormator } = require('./../console/consoleLogFormator');
const { server_getGuild } = require('./../guild/management/serverGetGuild');
const { checkAuthorInChannel } = require('./../guild/management/checkAuthorInChannel');
//
function player_ConnectFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 11) return message.channel.send('Please wait until the queue ended');
	if (code == 10) return message.channel.send('Please enter a Voice channel');
	consoleLogFormator(`Trying to Connect VCchannel ID: ${authorVC.id} at ${guildObj.id}`);
	//! connect to author channel
	guildObj.player.connect(message, authorVC);
}

function player_DisconnectFunction(client, message) {
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 20) return message.channel.send('I am not in a Voice Channel');
	if (code == 10) return message.channel.send('You are not in the same Voice Channel');
	let guildObj = server_getGuild(client, message);
	consoleLogFormator(`Trying to Connect VCchannel ID: ${clientVC.id} at ${guildObj.id}`);
	//! disconenct
	guildObj.player.disconnect();
}

module.exports = {
	player_ConnectFunction,
	player_DisconnectFunction,
};
