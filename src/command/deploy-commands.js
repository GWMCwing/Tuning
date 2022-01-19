const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, TOKEN } = require('../../config.json');
const { commandDictionary } = require('./commandHandler');
//
let commands = [];
for (const commandNameObject in commandDictionary) {
	let command = new SlashCommandBuilder()
		.setName(commandNameObject)
		.setDescription(commandDictionary[commandNameObject].description);
	commands.push(command.toJSON());
}

const rest = new REST({ version: '9' }).setToken(TOKEN);

rest
	.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
