async function replyUserinfo(interaction) {
	await interaction.reply(
		`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`
	);
}
module.exports = replyUserinfo;
