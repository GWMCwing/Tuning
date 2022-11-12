import {
    GuildMember,
    Interaction,
    Message,
    VoiceBasedChannel,
    VoiceChannel,
} from 'discord.js';
import {
    CommandBase,
    CommandReturn,
    CommandType,
    CommandUsageBuilder,
} from '../commandBase';
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
    async execute_Interaction(
        interaction: Interaction
    ): Promise<CommandReturn> {
        return 'NOT_IMPLEMENTED';
    }
    async execute_Message(message: Message): Promise<CommandReturn> {
        const channel = message.member?.voice.channel;
        if (channel) {
            joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            return 'SUCCESS';
        }
        return 'ERROR';
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
    async execute_Interaction(
        interaction: Interaction
    ): Promise<CommandReturn> {
        return 'NOT_IMPLEMENTED';
    }
    async execute_Message(message: Message): Promise<CommandReturn> {
        if (message.guild) {
            guildManager.getGuild(message.guild.id).leaveVoiceChannel();
            return 'SUCCESS';
        }
        return 'ERROR';
    }
}
