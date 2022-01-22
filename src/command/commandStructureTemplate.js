const template = {
	help: {
		name: 'help',
		description: 'Displays the help message.',
		options: [
			{
				name: 'ping',
				description: 'ping something',
				type: 2, // 2 is type SUB_COMMAND_GROUP
				options: [
					{
						name: 'user',
						description: 'ping the user',
						type: 1, // 1 is type SUB_COMMAND
						options: [
							{
								name: 'user',
								description: 'the user to ping',
								type: 6,
								required: true,
							},
						],
					},
					{
						name: 'role',
						description: 'ping the role',
						options: [],
						type: 1, // 1 is type SUB_COMMAND
					},
				],
			},
		],
		/** @type {Function} */
		function: 'helpfunction',
	},
	ping: {
		name: 'ping',
		description: 'Pong!',
		options: [
			{
				name: 'input',
				type: 3,
				description: 'The input to be ponged.',
				required: false,
			},
		],
		/** @type {function} */
		function: require('../general/ping'),
	},
	user: {
		name: 'user',
		description: 'Displays your user information.',
		options: [],
		/** @type {function} */
		function: require('../user-client/information'),
	},
	server: {
		name: 'server',
		description: 'Displays server information.',
		options: [],
		/** @type {function} */
		function: require('../guild/information/guildinfo'),
	},
};
