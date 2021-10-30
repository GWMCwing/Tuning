const ytdl = require('ytdl-core');
const fs = require('fs');

const url = 'https://www.youtube.com/watch?v=e8xdG4zixgU';
getInfo(url);
async function getInfo(url) {
	let info = await ytdl.getBasicInfo(url);
	info = ytdl.filterFormats(info.formats, { quality: 'highestaudio' });
	fs.writeFileSync('./info.json', JSON.stringify(info.formats[0]), 'utf8');
}
