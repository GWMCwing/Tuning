function postData(url, data) {
	console.log(JSON.stringify(data));
	return fetch(url, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: new Headers({ 'Content-Type': 'application/json' }),
	});
}
function test() {
	return null;
}

function restartServer(delayTimer = 0) {
	let herf = window.location.href;
	herf = herf.split('/').slice(0, 3).join('/');
	postData(`${herf}/restart`, { delay: delayTimer })
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			console.log(data.msg);
			// todo with the data
		});
}
// in mili second default 2 min
function stopServer(delayTimer = 0) {
	let herf = window.location.href;
	herf = herf.split('/').slice(0, 3).join('/');
	postData(`${herf}/stop`, { delay: delayTimer })
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			console.log(data.msg);
			// todo with the data
		});
}

function updateDelay(delayTimeInMiliseconds) {
	let herf = window.location.href;
	herf = herf.split('/').slice(0, 3).join('/');
	postData(`${herf}/delay`, { delay: delayTimer })
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			console.log(data.msg);
			// todo with the data
		});
}

function serverCommand(commandInput) {
    let herf = window.location.href;
    herf = herf.split('/').slice(0, 3).join('/');
    postData(`${herf}/command`, { command: commandInput })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data.msg);
            // todo with the data
        });
}
