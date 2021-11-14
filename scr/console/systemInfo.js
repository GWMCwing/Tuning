// may not be implemented, in ignore import List
const os = require('os');
//
/**
 * get system info ram usage, uptime, cpu architechure and os platform
 * @param {object} client
 * @param {object} message
 */
function getSystemInfo(client, message) {
	//? able to run in docker?
	let cpuArchi = os.arch();
	let osPlatform = os.platform();
	//
	let freeRam = os.freemem(); // in bytes
	let totalRam = os.totalmem(); // in bytes
	//
	let upTime = os.uptime();
}
