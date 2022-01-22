const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, TOKEN } = require('../../config.json');
const { commandDictionary } = require('./commandHandler');
const logging = require('../console/logging');
const { loggingConstant } = require('../globalConstant/constant');
//
const commands = [];
// start building the slash command
logging(
	loggingConstant.type.info,
	loggingConstant.tag.buildCommand,
	`Building Commands...`
);
for (const commandName in commandDictionary) {
	const commandObject = commandDictionary[commandName];
	const slashCommandObject = new SlashCommandBuilder();
	buildSlashCommand(slashCommandObject, commandName, commandObject);
	commands.push(slashCommandObject.toJSON());
}
if (Object.keys(commandDictionary).length === 0) {
	logging(
		loggingConstant.type.warn,
		loggingConstant.tag.buildCommand,
		`No Commands Found.`
	);
}
logging(
	loggingConstant.type.info,
	loggingConstant.tag.buildCommand,
	`Build Complete...`
);

const rest = new REST({ version: '9' }).setToken(TOKEN);

rest
	.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() =>
		logging(
			loggingConstant.type.info,
			loggingConstant.tag.buildCommand,
			'Successfully registered application commands.'
		)
	)
	.catch((error) =>
		logging(loggingConstant.type.error, loggingConstant.tag.buildCommand, error)
	);
//
// end of main building
//
// building functions
function buildSlashCommand(slashCommandObject, name, commandObject) {
	// commandObject will be the object that contains the command information
	logging(
		loggingConstant.type.info,
		loggingConstant.tag.buildCommand,
		`Building Slash Command: ${name}`
	);
	const { options } = commandObject;
	if (!commandObject.name || !commandObject.description)
		errorNameDescriptionDNE(commandObject);
	if (commandObject.name !== name)
		return logging(
			loggingConstant.type.error,
			loggingConstant.tag.buildCommand,
			`Name does not match. ${name} !== ${commandObject.name}\nBuild for this Command Aborted.`
		);
	// basic command => /command
	addBasicOptionInfo(slashCommandObject, commandObject, false);
	//
	if (!options || options.constructor !== Array) {
		// does not have options
		warnOptionDNE(commandObject);
	} else {
		// have options => /command [subcommandgroup|subcommand|options]
		const optionLen = options.length;
		for (let i = 0; i < optionLen; i++) {
			const commandObjectOption = options[i];
			typeToCommand(slashCommandObject, commandObjectOption);
		}
	}
	logging(
		loggingConstant.type.info,
		loggingConstant.tag.buildCommand,
		`Done...`
	);
}
/**
 * @description map the type to the correct function for adding corresponding option
 * @param {Object} slashCommandObject - the Slash Command Object from discord.js
 * @param {Object} commandObject - the command object from the command dictionary
 * @param {integer} parentType - the type of the parent command (1 = subcommand, 2 = subcommand group, orthers are ommited)
 * @returns
 */
function typeToCommand(slashCommandObject, commandObject, parentType = null) {
	let { type } = commandObject;
	if (parentType === 2 && type !== 1)
		throw logging(
			loggingConstant.type.error,
			loggingConstant.tag.buildCommand,
			`Parent is a Sub Command Group, but child is not a Sub Command.\nBuild for this Command Aborted.`
		);
	switch (type) {
		case 1:
			debugBuilderOptionStart(commandObject, 'Sub Command');
			addSubCommandType(slashCommandObject, commandObject);
			break;
		case 2:
			debugBuilderOptionStart(commandObject, 'Sub Command Group');
			addSubCommandGroupType(slashCommandObject, commandObject);
			break;
		case 3:
			debugBuilderOptionStart(commandObject, 'String');
			addStringOptionType(slashCommandObject, commandObject);
			debugBuilderOptionEnd(commandObject, 'String');
			break;
		case 4:
			debugBuilderOptionStart(commandObject, 'Integer');
			addIntegerOptionType(slashCommandObject, commandObject);
			debugBuilderOptionEnd(commandObject, 'Integer');
			break;
		case 5:
			debugBuilderOptionStart(commandObject, 'Boolean');
			addBooleanOptionType(slashCommandObject, commandObject);
			debugBuilderOptionEnd(commandObject, 'Boolean');
			break;
		case 6:
			debugBuilderOptionStart(commandObject, 'User');
			addUserOptionType(slashCommandObject, commandObject);
			debugBuilderOptionEnd(commandObject, 'User');
			break;
		case 7:
			debugBuilderOptionStart(commandObject, 'Channel');
			addChannelOptionType(slashCommandObject, commandObject);
			debugBuilderOptionEnd(commandObject, 'Channel');
			break;
		case 8:
			debugBuilderOptionStart(commandObject, 'Role');
			addRoleOptionType(slashCommandObject, commandObject);
			debugBuilderOptionEnd(commandObject, 'Role');
			break;
		case 9:
			debugBuilderOptionStart(commandObject, 'Mentionable');
			addMentionableOptionType(slashCommandObject, commandObject);
			debugBuilderOptionEnd(commandObject, 'Mentionable');
			break;
		case 10:
			debugBuilderOptionStart(commandObject, 'Number');
			addNumberOptionType(slashCommandObject, commandObject);
			debugBuilderOptionEnd(commandObject, 'Number');
			break;
		default:
			logging(
				loggingConstant.type.error,
				loggingConstant.tag.buildCommand,
				'Invalid option type.\n' + JSON.stringify(commandObject, null, 2)
			);
			break;
	}
}
//
//
/** Add subcommand groups or subcommand or options */
//
/**
 * @description add a subcommand to the slash command object (type 1)
 * @param {Object} slashCommandObject - the Slash Command Object from discord.js
 * @param {Object} commandObject - the command object from the command dictionary
 */
function addSubCommandType(slashCommandObject, commandObject) {
	slashCommandObject.addSubcommand((subcommand) => {
		checkNameDescription(commandObject);
		addBasicOptionInfo(subcommand, commandObject, false);
		debugBuilderOptionEnd(commandObject, 'Sub Command');
		const { options } = commandObject;
		if (!options || options.constructor !== Array) {
			warnOptionDNE(commandObject);
			return subcommand;
		}
		//
		const optionLen = options.length;
		for (let i = 0; i < optionLen; i++) {
			const commandObjectOption = options[i];
			typeToCommand(subcommand, commandObjectOption, 1);
		}
		return subcommand;
	});
}
/**
 * @description add a subCommandGroup to the slash command object (type 2)
 * @param {Object} slashCommandObject - the Slash Command Object from discord.js
 * @param {Object} commandObject - the command object from the command dictionary
 */
function addSubCommandGroupType(slashCommandObject, commandObject) {
	slashCommandObject.addSubcommandGroup((subcommandGroup) => {
		checkNameDescription(commandObject);
		addBasicOptionInfo(subcommandGroup, commandObject, false);
		debugBuilderOptionEnd(commandObject, 'Sub Command Group');
		const { options } = commandObject;

		if (!options || options.constructor !== Array)
			warnOptionDNE(commandObject, true);
		const optionLen = options.length;
		for (let i = 0; i < optionLen; i++) {
			const commandObjectOption = options[i];
			typeToCommand(subcommandGroup, commandObjectOption, 2);
		}
		return subcommandGroup;
	});
}
/**
 * @description add a String option to the slash command object (type 3)
 * @param {Object} slashCommandObject - the Slash Command Object from discord.js
 * @param {Object} commandObject - the command object from the command dictionary
 */
function addStringOptionType(slashCommandObject, commandObject) {
	slashCommandObject.addStringOption((option) => {
		checkNameDescription(commandObject);
		addBasicOptionInfo(option, commandObject);
		const { choices, options } = commandObject;

		if (options !== undefined) warnOptionDNS(commandObject, 'String');
		if (choices && choices.constructor === Array) {
			console.log(choices);
			option.addChoices(choices);
		}
		return option;
	});
}
/**
 * @description add a Integer option to the slash command object (type 4)
 * @param {Object} slashCommandObject - the Slash Command Object from discord.js
 * @param {Object} commandObject - the command object from the command dictionary
 */
function addIntegerOptionType(slashCommandObject, commandObject) {
	slashCommandObject.addIntegerOption((option) => {
		checkNameDescription(commandObject);
		addBasicOptionInfo(option, commandObject);
		const { choices, options } = commandObject;
		if (options !== undefined) warnOptionDNS(commandObject, 'String');
		if (choices && choices.constructor === Array) {
			option.addChoices(choices);
		}
		return option;
	});
}
/**
 * @description add a Number option to the slash command object (type 10)
 * @param {Object} slashCommandObject - the Slash Command Object from discord.js
 * @param {Object} commandObject - the command object from the command dictionary
 */
function addNumberOptionType(slashCommandObject, commandObject) {
	slashCommandObject.addNumberOption((option) => {
		checkNameDescription(commandObject);
		addBasicOptionInfo(option, commandObject);
		const { choices, options } = commandObject;
		if (options !== undefined) warnOptionDNS(commandObject, 'String');
		if (choices && choices.constructor === Array) {
			option.addChoices(choices);
		}
		return option;
	});
}
/**
 * @description add a Boolean option to the slash command object (type 5)
 * @param {Object} slashCommandObject - the Slash Command Object from discord.js
 * @param {Object} commandObject - the command object from the command dictionary
 */
function addBooleanOptionType(slashCommandObject, commandObject) {
	slashCommandObject.addBooleanOption((option) => {
		checkNameDescription(commandObject);
		addBasicOptionInfo(option, commandObject);
		const { choices, options } = commandObject;
		if (options !== undefined) warnOptionDNS(commandObject, 'String');
		if (choices) warnChoiceDNS(commandObject, 'Boolean');
		return option;
	});
}
/**
 * @description add a User option to the slash command object (type 6)
 * @param {Object} slashCommandObject - the Slash Command Object from discord.js
 * @param {Object} commandObject - the command object from the command dictionary
 */
function addUserOptionType(slashCommandObject, commandObject) {
	slashCommandObject.addUserOption((option) => {
		checkNameDescription(commandObject);
		addBasicOptionInfo(option, commandObject);
		const { choices, options } = commandObject;
		if (options !== undefined) warnOptionDNS(commandObject, 'String');
		if (choices) warnChoiceDNS(commandObject, 'User');
		return option;
	});
}
/**
 * @description add a Channel option to the slash command object (type 7)
 * @param {Object} slashCommandObject - the Slash Command Object from discord.js
 * @param {Object} commandObject - the command object from the command dictionary
 */
function addChannelOptionType(slashCommandObject, commandObject) {
	slashCommandObject.addChannelOption((option) => {
		checkNameDescription(commandObject);
		addBasicOptionInfo(option, commandObject);
		const { choices, options } = commandObject;
		if (options !== undefined) warnOptionDNS(commandObject, 'String');
		if (choices) warnChoiceDNS(commandObject, 'Channel');
		return option;
	});
}
/**
 * @description add a Role option to the slash command object (type 8)
 * @param {Object} slashCommandObject - the Slash Command Object from discord.js
 * @param {Object} commandObject - the command object from the command dictionary
 */
function addRoleOptionType(slashCommandObject, commandObject) {
	slashCommandObject.addRoleOption((option) => {
		checkNameDescription(commandObject);
		addBasicOptionInfo(option, commandObject);
		const { choices, options } = commandObject;
		if (options !== undefined) warnOptionDNS(commandObject, 'String');
		if (choices) warnChoiceDNS(commandObject, 'Role');
		return option;
	});
}
/**
 * @description add a Mentionable option to the slash command object (type 9)
 * @param {Object} slashCommandObject - the Slash Command Object from discord.js
 * @param {Object} commandObject - the command object from the command dictionary
 */
function addMentionableOptionType(slashCommandObject, commandObject) {
	slashCommandObject.addMentionableOption((option) => {
		checkNameDescription(commandObject);
		addBasicOptionInfo(option, commandObject);
		const { choices, options } = commandObject;
		if (options !== undefined) warnOptionDNS(commandObject, 'String');
		if (choices) warnChoiceDNS(commandObject, 'Menionable');
		return option;
	});
}
//
//
/**
 * @description add a basic option info to the command object (name and Description and ?Required)
 * @param {Object} commandBuilder - the Slash Command Object from discord.js
 * @param {Object} commandObject - the command object from the command dictionary
 * @param {Boolean} addRequire Toggle to add the require option (default: true)
 */
function addBasicOptionInfo(commandBuilder, commandObject, addRequire = true) {
	const { name, description } = commandObject;
	logging(
		loggingConstant.type.debug,
		loggingConstant.tag.buildCommand,
		`Adding Basic Option Info: ${commandObject.name}`
	);
	commandBuilder.setName(name).setDescription(description);
	if (addRequire) commandBuilder.setRequired(required || false);
}
/**
 * @description check if the command object has a name and description
 * @param {Object} commandObject - the command object from the command dictionary
 */
function checkNameDescription(commandObject) {
	if (!commandObject.name || !commandObject.description)
		errorNameDescriptionDNE(commandObject);
}
//
//
/**  logging functions */
//
/**
 * @description log an error if the command object does not have a name or description
 * @param {Object} commandObject - the command object from the command dictionary
 */
function errorNameDescriptionDNE(commandObject) {
	logging(
		loggingConstant.type.error,
		loggingConstant.tag.buildCommand,
		`Name or Description is not defined.\n` +
			JSON.stringify(commandObject, null, 2)
	);
}
/**
 * @description log an error or warning if the options is not an array or does not exist
 * @param {Object} commandObject - the command object from the command dictionary
 * @param {Boolean} error Toggle to log an error instead of warning (default: false)
 */
function warnOptionDNE(commandObject, error = false) {
	let loggingType = loggingConstant.type.warn;
	if (error) {
		loggingType = loggingConstant.type.error;
	}
	logging(
		loggingType,
		loggingConstant.tag.buildCommand,
		`Options is not an array or does not exist.\n` +
			JSON.stringify(commandObject, null, 2) +
			'\nUse `options: []` to supress this warning'
	);
}
function warnOptionDNS(commandObject, type) {
	logging(
		loggingConstant.type.warn,
		loggingConstant.tag.buildCommand,
		`Options is not supported in ${type}\n` +
			JSON.stringify(commandObject, null, 2)
	);
}
/**
 * @description log an warning if the options does not support choices as options
 * @param {Object} commandObject - the command object from the command dictionary
 * @param {String} type - the type of command being modified
 */
function warnChoiceDNS(commandObject, type) {
	logging(
		loggingConstant.type.warn,
		loggingConstant.tag.buildCommand,
		`${type} option does not support choices.\n` +
			JSON.stringify(commandObject, null, 2)
	);
}
/**
 * @description log an debug info when starting to add a command
 * @param {Object} commandObject - the command object from the command dictionary
 * @param {String} type - the type of command being added
 */
function debugBuilderOptionStart(commandObject, type) {
	logging(
		loggingConstant.type.debug,
		loggingConstant.tag.buildCommand,
		`Adding ${type} option ${commandObject.name}`
	);
}
/**
 * @description log an debug info when a command is added
 * @param {Object} commandObject - the command object from the command dictionary
 * @param {String} type - the type of command being added
 */
function debugBuilderOptionEnd(commandObject, type) {
	logging(
		loggingConstant.type.debug,
		loggingConstant.tag.buildCommand,
		`Added ${type} option ${commandObject.name}...`
	);
}
