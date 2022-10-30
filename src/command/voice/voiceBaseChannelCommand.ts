import {
    GuildMember,
    Interaction,
    Message,
    VoiceBasedChannel,
    VoiceChannel,
} from 'discord.js';
import { CommandBase, CommandUsageBuilder } from '../commandBase';
import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';

export class joinChannelCommand extends CommandBase {
    constructor() {
        const name = 'join';
        const description = 'Join the voice channel';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases = ['j'];
        super(name, description, usage, aliases);
    }
    execute_Interaction(interaction: Interaction): boolean {
        return false;
    }
    execute_Message(message: Message): boolean {
        const channel = message.member?.voice.channel;
        if (channel) {
            joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            return true;
        }
        return false;
    }
}
export class leaveChannelCommand extends CommandBase {
    constructor() {
        const name = 'leave';
        const description = 'leave the voice channel';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases = ['l'];
        super(name, description, usage, aliases);
    }
    execute_Interaction(interaction: Interaction): boolean {
        return false;
    }
    execute_Message(message: Message): boolean {
        if (message.guild) {
            const channelConnection = getVoiceConnection(message.guild.id);
            if (channelConnection) {
                channelConnection.destroy();
                return true;
            }
        }
        return false;
    }
}
