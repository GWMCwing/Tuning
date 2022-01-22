const logging = require('../console/logging');
const { loggingConstant } = require('../globalConstant/constant');
//
/**
 * @description check if the message or interaction exists
 * @param {object?} interaction - interaction object from discord.js
 * @param {object?} message - message object from discord.js
 * @param {string} functionName - name of the function calling this function
 * @returns {boolean} - true if the interaction or message exist
 */
function validateInteractionMessage(interaction, message, functionName) {
	if (!interaction ^ !message) {
		return true;
	}
	logging(
		loggingConstant.type.error,
		loggingConstant.tag.command,
		`${functionName}: Interaction or message is incorrect or missing.
        Interaction: ${!!interaction} \tMessage: ${!!message}`
	);
	return false;
}
/**
 * @description check if the message or interaction exists and the args are not empty or null
 *
 * if args are nullable use validateInteractionMessage
 * @param {object?} interaction - interaction object from discord.js
 * @param {object?} message - message object from discord.js
 * @param {string[]?} args - arguments for the function
 * @param {string} functionName - name of the function calling this function
 * @returns
 */
function validateInteractionMessageArgs(
	interaction,
	message,
	args,
	functionName
) {
	if (!interaction ^ !message && !!args) {
		return true;
	}
	logging(
		loggingConstant.type.error,
		loggingConstant.tag.command,
		`${functionName}: Interaction, message or args is incorrect or missing.
        Interaction: ${!!interaction} \tMessage: ${!!message} \tArgs: ${!!args}
        `
	);
	return false;
}

module.exports = { validateInteractionMessage, validateInteractionMessageArgs };
