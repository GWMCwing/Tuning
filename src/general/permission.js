/**
 * @description check if client has permission to send message in channel
 * @param {object} msg - discordjs message object or interaction
 * @param {string[]} permissions - discordjs permission array
 * @returns {boolean} true if the client has all the permissions
 */
function checkPermissionInChannel(msg, permissions) {
	for (permission in permissions) {
		if (!msg.channel.permissionsFor(msg.guild.me).has(permission)) return false;
	}
	return true;
}

/**
 * @description reply to the user in dm channel if a client does not have permission to send message in channel
 * @param {string} commandName - name of the command that is missing permission
 * @param {object} author - discordjs user object
 * @param {object} client - discordjs client object
 * @param {object} recievedAction - discordjs message object or interaction
 * @param {string[]} permissions - discordjs permission array
 */
function missPermissionInMessageChannel(
	commandName,
	author,
	client,
	recievedAction,
	permissions
) {
	const message = [
		`<@${client.id}> is missing permissions to send messages in designated channel when using \`${commandName}\` command.`,
	];
	message.push(
		`Guild (id): \`${recievedAction.guild.name} (${recievedAction.guild.id})\``
	);
	message.push(
		`Message Channel: \`${recievedAction.channel.name}\` (<#${recievedAction.channel.id}>)`
	);
	message.push(`Client(Bot) (id): \`${client.displayName} (${client.id})\``);
	message.push(`Required Permission: \`${permissions.join(', ')}\``);
	message.push(
		'\nPlease contact the server owner with the above information to request permissions.'
	);
	author
		.createDM()
		.then((dmChannel) => {
			dmChannel.send(message.join('\n'));
		})
		.catch((error) => {
			logging(
				loggingConstant.type.error,
				loggingConstant.tag.command,
				`Error in missPermissionInMessageChannel: ${error}`
			);
		});
}

module.exports = { checkPermissionInChannel, missPermissionInMessageChannel };
