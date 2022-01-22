const { MessageEmbed } = require('discord.js');
const { validateInteractionMessage } = require('../command/commandValidator');
const logging = require('../console/logging');
const { loggingConstant } = require('../globalConstant/constant');
const { getGuildInGuildVarData } = require('../guild/guildData');
const {
	checkPermissionInChannel,
	missPermissionInMessageChannel,
} = require('./permission');
/**
 * @description reply to the user with a help message
 * @param {object?} interaction
 * @param {object?} message
 * @param {string[]?} args
 */
async function replyHelpMessage({ interaction, message, args }) {
	//! must have these lines
	validateInteractionMessage(interaction, message, 'replyHelpMessage');
	const recievedAction = interaction || message;
	const requirePermissions = ['SEND_MESSAGES', 'EMBED_LINKS'];
	const client = recievedAction.guild.me;
	if (!checkPermissionInChannel(recievedAction, requirePermissions)) {
		const author = recievedAction.author || recievedAction.user;
		missPermissionInMessageChannel(
			'Help',
			author,
			client,
			recievedAction,
			requirePermissions
		);
		return;
	}
	//!
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
