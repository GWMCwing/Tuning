import {
    GuildMember,
    Interaction,
    Message,
    VoiceBasedChannel,
    VoiceChannel,
} from 'discord.js';
import { CommandBase, CommandType, CommandUsageBuilder } from '../commandBase';
import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';
import { guildManager } from '../../guild/Guild';

export class joinChannelCommand extends CommandBase {
    constructor() {
        const name = 'join';
        const type: CommandType = 'VOICE';
        const description = 'Join the voice channel';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases = ['j'];
        super(name, type, description, usage, aliases);
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
        const type: CommandType = 'VOICE';
        const description = 'leave the voice channel';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases = ['l'];
        super(name, type, description, usage, aliases);
    }
    execute_Interaction(interaction: Interaction): boolean {
        return false;
    }
    execute_Message(message: Message): boolean {
        if (message.guild) {
            guildManager.getGuild(message.guild.id).leaveVoiceChannel();
            return true;
        }
        return false;
    }
}
