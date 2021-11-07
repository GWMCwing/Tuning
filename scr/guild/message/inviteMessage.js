function inviteFunction(client, message) {
	return message.channel.send(
		'Please use this Link to invite the bot:\n https://discord.com/oauth2/authorize?client_id=670964358393888768&permissions=137442454592&scope=bot'
	);
}
//
// Export
module.exports = inviteFunction;
