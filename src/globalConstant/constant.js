/**
 * dictionary implementation of global constants
 * @global
 * @var {object}
 */
const globalConstant = {
	/** @var {object} */
	loggingConstant: {
		/** @var {object} */
		type: {
			debug: 0,
			info: 1,
			warn: 2,
			error: 3,
		},
		tag: {
			runtime: 'runtime',
			message: 'message',
			command: 'command',
			buildCommand: 'buildCommand',
		},
	},
	/**
	 * {sameChannel}{ClientInChannel}{UserInChannel}
	 */
	voiceChannelStatusConstant: {
		noneInVC: 0, // 000
		onlyUserInVC: 1, // 001
		onlyClientInVC: 2, // 010
		bothInSeparateVC: 3, // 011
		bothInSameVC: 7, // 111
	},
};

module.exports = globalConstant;
