function getAuthorVCchannelFunction(client, message) {
	return message.member.voice.channel;
}
function getClientVCchannelFunction(client, message) {
	return message.guild.me.voice.channel;
}

module.exports = {
	getAuthorVCchannelFunction,
	getClientVCchannelFunction,
};
