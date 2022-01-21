function getUserVoiceChannel(interaction = null, message = null, args = null) {
	if (!(!interaction ^ !message)) {
		return logging(
			loggingConstant.type.error,
			loggingConstant.tag.runtime,
			'getUserVoiceChannel: Missing interaction or message'
		);
	}
	const recievedAction = interaction || message;
	const user = recievedAction.member;
	return user.voice.channel;
}

function getClientVoiceChannel(
	interaction = null,
	message = null,
	args = null
) {
	if (!(!interaction ^ !message)) {
		return logging(
			loggingConstant.type.error,
			loggingConstant.tag.runtime,
			'getClientVoiceChannel: Missing interaction or message'
		);
	}
	const recievedAction = interaction || message;
	const client = recievedAction.guild.client;
	return client.voice.channel;
}

function clientUserVoiceChannelStatus(
	interaction = null,
	message = null,
	args = null
) {
	if (!(!interaction ^ !message)) {
		return logging(
			loggingConstant.type.error,
			loggingConstant.tag.runtime,
			'clientUserVoiceChannelStatus: Missing interaction or message'
		);
	}
	const clientVC = getClientVoiceChannel(interaction, message);
	const userVC = getUserVoiceChannel(interaction, message);
	let returnValue = 0;
	if (!!userVC) returnValue += 1;
	if (!!clientVC) returnValue += 2;
	if (returnValue === 3 && clientVC.id === userVC.id) returnValue += 4;
	return returnValue;
}
