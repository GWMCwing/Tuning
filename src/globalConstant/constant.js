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
		},
	},
	/**
	 * {sameChannel}{ClientInChannel}{UserInChannel}
	 */
	voiceChannelStatusConstant:{
		noneInVC: 0, // 000
		onlyUserInVC: 1, // 001
		onlyClientInVC: 2, // 010
		bothIn_Separate_VC = 3, // 011
		bothIn_Same_VC = 7, // 111
	}
};

module.exports = globalConstant;
