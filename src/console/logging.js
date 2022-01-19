const { logginConstant } = require('../globalConstant/constant');
/**
 * console log format in
 *  {time} {type} {message} with color in HKT
 * @param {integer} type - logginConstant.type value (0: debug, 1: info, 2: warn, 3: error)
 * @param {string} message - message to be sent to console
 */
function logging(type, message) {
	var date = new Date();
	const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
	const hkTime = new Date(utcTime + 3600000 * 8);
	const hour = ('0' + hkTime.getHours()).slice(-2);
	const minute = ('0' + hkTime.getMinutes()).slice(-2);
	const second = ('0' + hkTime.getSeconds()).slice(-2);
	const time = `${hour}:${minute}:${second}`;
	const day = ('0' + hkTime.getDate()).slice(-2);
	const month = ('0' + hkTime.getMonth() + 1).slice(-2);
	let outputMessage;
	//
	switch (type) {
		case logginConstant.type.debug:
			outputMessage = `${day}/${month}-${time} [DEBUG] ${message}`;
			// log in dim gray
			console.log('\x1b[2m%s\x1b[0m', outputMessage);
			break;
		case logginConstant.type.info:
			outputMessage = `${day}/${month}-${time} [INFO] ${message}`;
			// log in normal
			console.log(outputMessage);
			break;
		case logginConstant.type.warn:
			outputMessage = `${day}/${month}-${time} [WARN] ${message}`;
			// log in yellow
			console.log('\x1b[33m%s\x1b[0m', outputMessage);
			break;
		case logginConstant.type.error:
			outputMessage = `${day}/${month}-${time} [ERROR] ${message}`;
			// log in red
			console.log('\x1b[31m%s\x1b[0m', outputMessage);
			break;
		default:
			console.log('\x1b[31m%s\x1b[0m', 'logging type error');
	}
}

module.exports = logging;
