import {
    getVoiceConnection,
    joinVoiceChannel,
    VoiceConnection,
} from '@discordjs/voice';
import {
    Channel,
    Client,
    GuildMember,
    Interaction,
    Message,
    VoiceBasedChannel,
} from 'discord.js';
import { guildManager } from '../../guild/Guild';
import { logger } from '../../util/logger';
import { CommandBase, CommandUsageBuilder } from '../commandBase';

type ChannelDifference =
    | 'SAME_CHANNEL'
    | 'NOT_SAME_CHANNEL'
    | 'CLIENT_NO_CHANNEL'
    | 'USER_NO_CHANNEL';

async function getChannelDifference(
    client: Client,
    member: GuildMember
): Promise<{
    channelDifference: ChannelDifference;
    userVoiceChannel: VoiceBasedChannel | null;
}> {
    let channelDifference: ChannelDifference = 'NOT_SAME_CHANNEL';
    const userChannel = member.voice.channel;
    if (userChannel === null) {
        channelDifference = 'USER_NO_CHANNEL';
    } else {
        if (userChannel.members.has(client.user!.id)) {
            channelDifference = 'SAME_CHANNEL';
        } else {
            channelDifference = 'CLIENT_NO_CHANNEL';
        }
    }
    return {
        channelDifference,
        userVoiceChannel: userChannel,
    };
}

export class playTrackChannelCommand extends CommandBase {
    constructor() {
        const name = 'play';
        const description = 'play the given track';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases = ['p'];
        super(name, description, usage, aliases);
        this.requireArgs.set('track', 'The track to play');
    }
    async execute_Interaction(interaction: Interaction): Promise<boolean> {
        return false;
    }
    async execute_Message(message: Message, args: string[]): Promise<boolean> {
        if (!message.guild) {
            message.reply('This command can only be used in a guild');
            return false;
        }
        const musicPlayer = guildManager.getGuild(message.guild.id).musicPlayer;
        if (args.length === 0) {
            musicPlayer.play();
            return true;
        }
        //
        let connection: VoiceConnection;
        let { channelDifference, userVoiceChannel } =
            await getChannelDifference(message.client, message.member!);
        if (
            channelDifference === 'SAME_CHANNEL' ||
            channelDifference === 'CLIENT_NO_CHANNEL'
        ) {
            connection = joinVoiceChannel({
                channelId: userVoiceChannel!.id,
                guildId: userVoiceChannel!.guild.id,
                adapterCreator: userVoiceChannel!.guild.voiceAdapterCreator,
            });
        } else {
            return false;
        }
        //
        const trackList = await musicPlayer.addToQueue(args.join(' '));
        if (trackList) {
            if (trackList.length > 1) {
                //TODO send message with list of tracks, using interactive message
                message.reply(`Added ${trackList.length} track(s) to queue`);
            } else {
                message.reply(`Added ${trackList[0].title} track to queue`);
            }
            connection.subscribe(musicPlayer.getPlayer());
            if (musicPlayer.play()) return true;
            else {
                message.reply('Failed to play track');
                return false;
            }
        }
        message.reply('Failed to add track to queue');
        return false;
    }
}

export class pauseTrackChannelCommand extends CommandBase {
    constructor() {
        const name = 'pause';
        const description = 'pause current queue';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases = ['pa'];
        super(name, description, usage, aliases);
    }
    async execute_Interaction(interaction: Interaction): Promise<boolean> {
        return false;
    }
    async execute_Message(message: Message, args: string[]): Promise<boolean> {
        if (!message.guild) return false;
        let { channelDifference } = await getChannelDifference(
            message.client,
            message.member!
        );
        if (channelDifference === 'SAME_CHANNEL') {
            const musicPlayer = guildManager.getGuild(
                message.guild.id
            ).musicPlayer;
            musicPlayer.pause();
            return true;
        }
        return false;
    }
}

export class resumeTrackChannelCommand extends CommandBase {
    constructor() {
        const name = 'resume';
        const description = 'resume queue';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases = ['rs'];
        super(name, description, usage, aliases);
    }
    async execute_Interaction(interaction: Interaction): Promise<boolean> {
        return false;
    }
    async execute_Message(message: Message, args: string[]): Promise<boolean> {
        if (!message.guild) return false;
        let { channelDifference } = await getChannelDifference(
            message.client,
            message.member!
        );
        if (channelDifference === 'SAME_CHANNEL') {
            const musicPlayer = guildManager.getGuild(
                message.guild.id
            ).musicPlayer;
            musicPlayer.resume();
            return true;
        }
        return false;
    }
}

export class skipTrackChannelCommand extends CommandBase {
    constructor() {
        const name = 'skip';
        const description = 'skip track';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases = ['sk'];
        super(name, description, usage, aliases);
    }
    async execute_Interaction(interaction: Interaction): Promise<boolean> {
        return false;
    }
    async execute_Message(message: Message, args: string[]): Promise<boolean> {
        if (!message.guild) return false;
        let { channelDifference } = await getChannelDifference(
            message.client,
            message.member!
        );
        if (channelDifference === 'SAME_CHANNEL') {
            const musicPlayer = guildManager.getGuild(
                message.guild.id
            ).musicPlayer;
            musicPlayer.playNext();
            return true;
        }
        return false;
    }
}

export class previousTrackChannelCommand extends CommandBase {
    constructor() {
        const name = 'previous';
        const description = 'play previous track';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases: string[] = [];
        super(name, description, usage, aliases);
    }
    async execute_Interaction(interaction: Interaction): Promise<boolean> {
        return false;
    }
    async execute_Message(message: Message, args: string[]): Promise<boolean> {
        if (!message.guild) return false;
        let { channelDifference } = await getChannelDifference(
            message.client,
            message.member!
        );
        if (channelDifference === 'SAME_CHANNEL') {
            const musicPlayer = guildManager.getGuild(
                message.guild.id
            ).musicPlayer;
            musicPlayer.playPrevious();
            return true;
        }
        return false;
    }
}

export class displayQueueCommand extends CommandBase {
    constructor() {
        const name = 'queue';
        const description = 'display current queue';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases = ['q'];
        super(name, description, usage, aliases);
    }
    async execute_Interaction(interaction: Interaction): Promise<boolean> {
        return false;
    }
    async execute_Message(message: Message, args: string[]): Promise<boolean> {
        if (!message.guild) return false;
        const queue = guildManager
            .getGuild(message.guild.id)
            .musicPlayer.getQueue();
        if (queue.length === 0) {
            message.reply('The queue is empty');
            return true;
        }
        let reply = 'The queue is:\n';
        for (let i = 0; i < queue.length; i++) {
            reply += `${i + 1}: ${queue[i].title}\n`;
            if (reply.length > 200) {
                reply += `...(${queue.length - i} more)`;
                break;
            }
        }
        message.reply(reply);
        return true;
    }
}
