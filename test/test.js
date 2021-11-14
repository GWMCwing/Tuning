const ytdl = require('ytdl-core');

const url = 'https://www.youtube.com/watch?v=6eTxcloeN00';

async function main(url) {
	let info = await ytdl.getBasicInfo(url);
	console.log(info);
	console.log(info.videoDetails.videoId);
	console.log(info.videoDetails.video_url);
	console.log(info.videoDetails.title);
	console.log(info.videoDetails.thumbnail);
}

main(url);
