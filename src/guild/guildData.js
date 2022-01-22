const logging = require('../console/logging');
const { loggingConstant } = require('../globalConstant/constant');
const { PREFIX } = require('../../config.json');
const guildVarData = {};
//
class guild {
	constructor(guildId) {
		this.guildId = guildId;
		this.playerObj = null;
		this.prefix = PREFIX;
	}
	set playerObj(newValue) {
		logging(
			loggingConstant.type.debug,
			loggingConstant.tag.runtime,
			`${this.guildId} playerObj set`
		);
	}
	get playerObj() {
		logging(
			loggingConstant.type.debug,
			loggingConstant.tag.runtime,
			`${this.guildId} playerObj get`
		);
	}

	addPlayerObj(playerObj) {
		this.playerObj = playerObj;
		return this.playerObj;
	}
	removePlayerObj() {
		this.playerObj = null;
	}
	getPlayerObj() {
		return this.playerObj;
	}
}
//
/**
 * @description get guildVarData a variable that stores all guilds related data
 * @returns {guild}
 */
function getGuildVarData() {
	logging(
		loggingConstant.type.warn,
		loggingConstant.tag.runtime,
		'GuildVarData accessed'
	);
	console.trace('GuildVarData Accessed Trace');
	return guildVarData;
}
/**
 * @description get guild from guildVarData if guild is in guildVarData else will create a new guild and add to guildVarData
 * @param {Number} guildId
 * @returns {guild} guildObject from this module
 */
function getGuildInGuildVarData(guildId) {
	if (!guildVarData[guildId]) {
		return addGuildToGuildVarData(guildId);
	}
	return guildVarData[guildId];
}
//
/**
 * @description check if guild is in guildVarData
 * @param {Number} guildId
 * @returns {Boolean} true if guildId is in guildVarData
 */
function isGuildInGuildVarData(guildId) {
	return guildVarData[guildId] !== undefined;
}
//
/**
 * @description add to guildVarData if guild is not in guildVarData
 * @param {Number} guildId
 * @returns {guild} guildObject from this module if it is not in guildVarData else return null
 */
function addGuildToGuildVarData(guildId) {
	if (isGuildInGuildVarData(guildId))
		return logging(
			loggingConstant.type.warn,
			loggingConstant.tag.runtime,
			`addGuildToGuildVarData: Guild ${guildId} already in guildVarData`
		);
	const newGuildObj = new guild(guildId);
	guildVarData[guildId] = newGuildObj;
	return newGuildObj;
}
/**
 * @description remove guild from guildVarData
 * @param {Number} guildId
 * @returns {Boolean} true if guildId is removed from guildVarData else return false if guildId is not in guildVarData
 */
function removeGuildFromGuildVarData(guildId) {
	if (!isGuildInGuildVarData(guildId)) {
		logging(
			loggingConstant.type.warn,
			loggingConstant.tag.runtime,
			`removeGuildFromGuildVarData: Guild ${guildId} not in guildVarData`
		);
		return false;
	}
	delete guildVarData[guildId];
	return true;
}

module.exports = {
	getGuildVarData,
	getGuildInGuildVarData,
	isGuildInGuildVarData,
	addGuildToGuildVarData,
	removeGuildFromGuildVarData,
};
