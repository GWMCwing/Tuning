const { loggingConstant } = require('../globalConstant/constant');
/**
 * console log format in
 *  {time} {type} {message} with color in HKT
 * @param {integer} type - loggingConstant.type value (0: debug, 1: info, 2: warn, 3: error)
 * @param {string} tag - tag for the log
 * @param {string} message - message to be sent to console
 */
function logging(type, tag, message) {
	const date = new Date();
	const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
	const hkTime = new Date(utcTime + 3600000 * 8);
	const hour = ('0' + hkTime.getHours()).slice(-2);
	const minute = ('0' + hkTime.getMinutes()).slice(-2);
	const second = ('0' + hkTime.getSeconds()).slice(-2);
	const time = `${hour}:${minute}:${second}`;
	const day = ('0' + hkTime.getDate()).slice(-2);
	const month = ('0' + hkTime.getMonth() + 1).slice(-2);
	//
	switch (type) {
		case loggingConstant.type.debug:
			// log in dim gray
			console.log(
				'\x1b[2m%s\x1b[0m',
				`${day}/${month}-${time} [DEBUG] [${tag}] ${message}`
			);
			break;
		case loggingConstant.type.info:
			// log in normal
			console.log(`${day}/${month}-${time} [INFO] [${tag}] ${message}`);
			break;
		case loggingConstant.type.warn:
			// log in yellow
			console.log(
				'\x1b[33m%s\x1b[0m',
				`${day}/${month}-${time} [WARN] [${tag}] ${message}`
			);
			break;
		case loggingConstant.type.error:
			// log in red
			console.log(
				'\x1b[31m%s\x1b[0m',
				`${day}/${month}-${time} [ERROR] [${tag}] ${message}`
			);
			break;
		default:
			logging(
				loggingConstant.type.error,
				loggingConstant.tag.runtime,
				'logging function called with invalid type'
			);
	}
}

module.exports = logging;
