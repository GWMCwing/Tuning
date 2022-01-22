const { MessageEmbed } = require('discord.js');
const { validateInteractionMessage } = require('../command/commandValidator');
const logging = require('../console/logging');
const { loggingConstant } = require('../globalConstant/constant');
const { getGuildInGuildVarData } = require('../guild/guildData');
const { checkPermissionInChannel } = require('../general/checkForPermission');
/**
 * @description reply to the user with a help message
 * @param {object?} interaction
 * @param {object?} message
 * @param {string[]?} args
 */
async function replyHelpMessage({ interaction, message, args }) {
	validateInteractionMessage(interaction, message, 'replyHelpMessage');
	const recievedAction = interaction || message;
	if (!checkPermissionInChannel(recievedAction, 'SEND_MESSAGES')) {
		logging(
			loggingConstant.type.warn,
			loggingConstant.tag.command,
			`User does not have permission to send messages in this channel
			guildId: ${recievedAction.guild.id}`
		);
	}
	const client = recievedAction.guild.me;
	const serverPrefix = getGuildInGuildVarData(recievedAction.guild.id).prefix;
	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle(`Help from ${client.displayName}!`)
		.setURL('https://github.com/GWMCwing/AuditBot')
		.setDescription(
			`This server uses \`${serverPrefix}\` as prefix. Click the above link to see the different commands.`
		);
	await recievedAction
		.reply({
			content: 'Here is the help message for this server.',
			embeds: [embed],
			ephemeral: true,
			allowedMentions: {
				repliedUser: false,
			},
		})
		.catch((error) => {
			logging(
				loggingConstant.type.error,
				loggingConstant.tag.command,
				`Error in replyHelpMessage: ${error}`
			);
		});
}

module.exports = { replyHelpMessage };
