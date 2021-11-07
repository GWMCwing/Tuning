//
async function player_PlayFunction(client, message) {
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 10) return message.channel.send('Please enter a voice channel');
	if (code == 11) return message.channel.send('Please wait until the queue ended');
	let guildObj = server_getGuild(client, message);
	// let url = message.content.split(' ').shift().join(' ');
	let url = message.content.split(' ');
	url.shift();
	url = url.join(' ');
	// console.log(url);
	if (!url) {
		player_ConnectFunction(client, message);
		guildObj.player.playNextSongifEnd(message, false, 0);
		return;
	}
	if (!guildObj.player.connection || clientVC.members.size == 1) guildObj.player.connect(message, authorVC);
	let addedSong = await guildObj.player.addSong(yt_search, url, message);
	if (!addedSong) return message.channel.send('no sound track added');
	message.channel.send('Added: ```' + guildObj.player.urlList.at(-1)[1] + ' ```');
	guildObj.player.playNextSongifEnd(message, false, 0);
}
//
function player_RemoveFromListFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	if (guildObj.player.urlList.length == 0) return message.channel.send('No sound track is in queue');
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 11) return message.channel.send('You are not in the same Voice Channel');
	//
	let indexStr = message.content.split(' ')[1];
	let index = parseInt(indexStr, 10);
	if (index.toString() === indexStr && index < guildObj.player.urlList.length) {
		guildObj.player.removeFromList(index, message);
		return true;
	}
	return message.channel.send(`${index} is not a correct index`);
}
//
function player_LoopFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	if (guildObj.player.urlList.length == 0) return message.channel.send('No sound track is in queue');
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 11) return message.channel.send('You are not in the same Voice Channel');
	guildObj.player.loopSong();
	return message.channel.send(`Loop sound track: ${guildObj.player.loopSongBool}`);
}
function player_LoopQueueFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	if (guildObj.player.urlList.length == 0) return message.channel.send('No sound track is in queue');
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 11) return message.channel.send('You are not in the same Voice Channel');
	guildObj.player.loopQueue();
	return message.channel.send(`Loop Queue: ${guildObj.player.loopQueueBool}`);
}
//
function player_ListQueueFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	let stringToSend = '```\n';
	let urlList = guildObj.player.urlList;
	if (!urlList.length) {
		return message.channel.send('0 sound track in Queue');
	}
	for (let i = 0; i < urlList.length; i++) {
		stringToSend += `${i}. ${urlList[i][1]}\n`;
		stringToSend += `      ${urlList[i][0]}\n`;
	}
	stringToSend += `Loop sound track: ${guildObj.player.loopSongBool}\n`;
	stringToSend += `Loop Queue: ${guildObj.player.loopQueueBool}\n`;
	stringToSend += '```';
	message.channel.send(stringToSend);
}
//
function player_NowPlayingFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	return message.channel.send(`Now Playing: ${guildObj.player.urlList[0][1]}`);
}
//
function player_ResumeFunction(client, message) {
	//
	let guildObj = server_getGuild(client, message);
	if (guildObj.player.urlList.length == 0) return message.channel.send('No sound track is in queue');
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 11) return message.channel.send('You are not in the same Voice Channel');
	guildObj.player.resume();
	return message.channel.send('Resumed playing');
}
//
function player_PauseFunction(client, message) {
	//
	let guildObj = server_getGuild(client, message);
	if (guildObj.player.urlList.length == 0) return message.channel.send('No sound track is in queue');
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 11) return message.channel.send('You are not in the same Voice Channel');
	guildObj.player.pause();
	return message.channel.send('Paused playing');
}
//
function player_SkipFunction(client, message) {
	//
	let guildObj = server_getGuild(client, message);
	if (guildObj.player.urlList.length == 0) return message.channel.send('No sound track is in queue');
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 11) return message.channel.send('You are not in the same Voice Channel');
	guildObj.player.skip();
}
//
function player_ClearFunction(client, message) {
	let guildObj = server_getGuild(client, message);
	if (guildObj.player.urlList.length == 0) return message.channel.send('No sound track is in queue');
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 11) return message.channel.send('You are not in the same Voice Channel');
	guildObj.player.clear();
}
//
function player_SeekFunction(client, message) {
	//
	return message.channel.send('Seek function is not avaliable due to library issues');
	let guildObj = server_getGuild(client, message);
	if (guildObj.player.urlList.length == 0) return message.channel.send('No sound track is in queue');
	let [code, authorVC, clientVC] = checkAuthorInChannel(client, message);
	if (code == 11) return message.channel.send('You are not in the same Voice Channel');
	let timeStr = message.content.split(' ')[1];
	let time = parseInt(timeStr, 10);
	if (time.toString() === timeStr && time >= 0) {
		guildObj.player.seek(message, time);
		return true;
	}
	return message.channel.send(`${time} is not a correct time in seconds`);
}
