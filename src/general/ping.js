const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const logging = require('../console/logging');
const { loggingConstant } = require('../globalConstant/constant');

/**
 *  template for different types of message or interaction handling
 *  and the parameter handling methods
 * @param {Object} interaction - the interaction object from discord.js
 * @param {Object} message - the message object from discord.js
 * @param {String[]} args - the arguments from the message
 * @returns
 */
async function pingPong(interaction = null, message = null, args = null) {
	// prevent missing interaction or message
	//TODO send message to user if missing
	// if((!interaction ^ !message) and ! args) for requiring args
	if (!(!interaction ^ !message)) {
		return logging(
			loggingConstant.type.error,
			loggingConstant.tag.runtime,
			'pingPong: Missing interaction or message'
		);
	}
	//
	const recievedAction = interaction || message;
	//
	let rows = [];
	for (let i = 0; i < 5; i++) {
		const row = new MessageActionRow();
		for (let j = 0; j < 5; j++) {
			row.addComponents(
				new MessageButton()
					.setCustomId('ping' + i + '' + j)
					.setLabel('Ping' + i + '' + j)
					.setStyle('PRIMARY')
			);
		}
		rows.push(row);
	}
	// embeded message
	const embed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Some title')
		.setURL('https://discord.js.org')
		.setDescription('Some description here');
	// reply

	await recievedAction.reply({
		content: 'Pong!',
		components: rows,
		embeds: [embed],
	});

	//
	// response to button interaction
	// filter should only be the button id of this message
	const filter = (i) => true;
	const collector = recievedAction.channel.createMessageComponentCollector({
		filter,
		time: 15000,
	});

	collector.on('collect', async (i) => {
		await i.update({
			content: `Button: ${i.customId} was clicked`,
			components: [],
		});
	});

	collector.on('end', (collected) =>
		// add more information to the end of the message
		// guild id and channel id of the message
		// or even save the time of the message being created
		// and put it in the message log
		logging(
			loggingConstant.type.debug,
			loggingConstant.tag.runtime,
			`Collected ${collected.size} items`
		)
	);
}

module.exports = pingPong;
