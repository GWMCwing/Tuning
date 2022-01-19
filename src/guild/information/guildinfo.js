async function replyGuildInfo(interaction) {
	await interaction.reply(
		`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
	);
}
module.exports = replyGuildInfo;
