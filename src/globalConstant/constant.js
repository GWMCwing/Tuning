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
};

module.exports = globalConstant;
