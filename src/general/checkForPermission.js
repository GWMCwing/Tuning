function checkPermissionInChannel(msg, permission) {
	return msg.channel.permissionsFor(msg.guild.me).has(permission);
}

module.exports = { checkPermissionInChannel };
