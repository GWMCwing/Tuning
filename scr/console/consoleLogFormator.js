// console log function
//TODO add type in front e.g. player, guild, bot
//TODO color https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
function consoleLogFormator(string, date = false) {
	let hk_date_string = new Date().toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' });
	let date_hk = new Date(hk_date_string);
	// console.log(date_hk);
	// hours as (HH) format
	let hours = ('0' + date_hk.getHours()).slice(-2);

	// minutes as (mm) format
	let minutes = ('0' + date_hk.getMinutes()).slice(-2);

	// seconds as (ss) format
	let seconds = ('0' + date_hk.getSeconds()).slice(-2);

	// time as hh:mm:ss format
	let timeString = hours + ':' + minutes + ':' + seconds;

	if (date) {
		// month as (MM) format
		let month = ('0' + (date_hk.getMonth() + 1)).slice(-2);

		// date as (DD) format
		let date = ('0' + date_hk.getDate()).slice(-2);
		// date and time as YYYY-MM-DD hh:mm:ss format
		timeString = date + '/' + month + ' - ' + timeString;
	}

	console.log('[' + timeString + '] ' + string);
}

//
// Export
module.exports = { consoleLogFormator };
