import { EmbedBuilder, Interaction, Message } from 'discord.js';
import { CommandBase, CommandType, CommandUsageBuilder } from '../commandBase';

export class helpCommand extends CommandBase {
    constructor() {
        const name = 'help';
        const type: CommandType = 'GENERAL';
        const description = 'send command list';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases: string[] = [];
        super(name, type, description, usage, aliases);
    }
    async execute_Interaction(interaction: Interaction): Promise<boolean> {
        return false;
    }
    async execute_Message(message: Message, args: string[]): Promise<boolean> {
        const embedMessage = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Help')
            .setDescription('List of commands')
            .setURL(
                'https://github.com/GWMCwing/Tuning/blob/Typescript-migrate/doc/helpList.md'
            )
            .setTimestamp();
        message.reply({ embeds: [embedMessage] });
        return false;
    }
}
