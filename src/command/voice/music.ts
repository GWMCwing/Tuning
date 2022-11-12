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
import { logger } from '../../util/app/logger';
import {
    CommandBase,
    CommandReturn,
    CommandType,
    CommandUsage,
    CommandUsageBuilder,
} from '../commandBase';

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
async function isSameChannel(
    client: Client,
    member: GuildMember
): Promise<Boolean> {
    return (
        (await getChannelDifference(client, member)).channelDifference ===
        'SAME_CHANNEL'
    );
}

export class PlayTrackChannelCommand extends CommandBase {
    constructor() {
        const name = 'play';
        const type: CommandType = 'VOICE';
        const description = 'play the given track';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases = ['p'];
        super(name, type, description, usage, aliases);
        this.requireArgs.set('track', 'The track to play');
    }
    async execute_Interaction(
        interaction: Interaction
    ): Promise<CommandReturn> {
        return 'NOT_IMPLEMENTED';
    }
    async execute_Message(
        message: Message,
        args: string[]
    ): Promise<CommandReturn> {
        if (!message.guild) {
            message.reply('This command can only be used in a guild');
            return 'NO_GUILD';
        }
        const musicPlayer = guildManager.getGuild(message.guild.id).musicPlayer;
        if (args.length === 0) {
            musicPlayer.play();
            return 'SUCCESS';
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
            return 'NOT_SAME_CHANNEL';
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
            if (musicPlayer.play()) return 'SUCCESS';
            else {
                message.reply('Failed to play track');
                return 'ERROR';
            }
        }
        message.reply('Failed to add track to queue');
        return 'ERROR';
    }
}

export class PauseTrackChannelCommand extends CommandBase {
    constructor() {
        const name = 'pause';
        const type: CommandType = 'VOICE';
        const description = 'pause current queue';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases = ['pa'];
        super(name, type, description, usage, aliases);
    }
    async execute_Interaction(
        interaction: Interaction
    ): Promise<CommandReturn> {
        return 'NOT_IMPLEMENTED';
    }
    async execute_Message(
        message: Message,
        args: string[]
    ): Promise<CommandReturn> {
        if (!message.guild) return 'NO_GUILD';
        if (await isSameChannel(message.client, message.member!)) {
            const musicPlayer = guildManager.getGuild(
                message.guild.id
            ).musicPlayer;
            musicPlayer.pause();
            return 'SUCCESS';
        }
        return 'ERROR';
    }
}

export class ResumeTrackChannelCommand extends CommandBase {
    constructor() {
        const name = 'resume';
        const type: CommandType = 'VOICE';
        const description = 'resume queue';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases = ['rs'];
        super(name, type, description, usage, aliases);
    }
    async execute_Interaction(
        interaction: Interaction
    ): Promise<CommandReturn> {
        return 'NOT_IMPLEMENTED';
    }
    async execute_Message(
        message: Message,
        args: string[]
    ): Promise<CommandReturn> {
        if (!message.guild) return 'NO_GUILD';
        if (await isSameChannel(message.client, message.member!)) {
            const musicPlayer = guildManager.getGuild(
                message.guild.id
            ).musicPlayer;
            musicPlayer.resume();
            return 'SUCCESS';
        }
        return 'ERROR';
    }
}

export class SkipTrackChannelCommand extends CommandBase {
    constructor() {
        const name = 'skip';
        const type: CommandType = 'VOICE';
        const description = 'skip track';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases = ['sk'];
        super(name, type, description, usage, aliases);
    }
    async execute_Interaction(
        interaction: Interaction
    ): Promise<CommandReturn> {
        return 'NOT_IMPLEMENTED';
    }
    async execute_Message(
        message: Message,
        args: string[]
    ): Promise<CommandReturn> {
        if (!message.guild) return 'NO_GUILD';
        if (await isSameChannel(message.client, message.member!)) {
            const musicPlayer = guildManager.getGuild(
                message.guild.id
            ).musicPlayer;
            musicPlayer.playNext();
            return 'SUCCESS';
        }
        return 'ERROR';
    }
}

export class PreviousTrackChannelCommand extends CommandBase {
    constructor() {
        const name = 'previous';
        const type: CommandType = 'VOICE';
        const description = 'play previous track';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases: string[] = [];
        super(name, type, description, usage, aliases);
    }
    async execute_Interaction(
        interaction: Interaction
    ): Promise<CommandReturn> {
        return 'NOT_IMPLEMENTED';
    }
    async execute_Message(
        message: Message,
        args: string[]
    ): Promise<CommandReturn> {
        if (!message.guild) return 'NO_GUILD';
        if (await isSameChannel(message.client, message.member!)) {
            const musicPlayer = guildManager.getGuild(
                message.guild.id
            ).musicPlayer;
            musicPlayer.playPrevious();
            return 'SUCCESS';
        }
        return 'ERROR';
    }
}

export class DisplayQueueCommand extends CommandBase {
    constructor() {
        const name = 'queue';
        const type: CommandType = 'VOICE';
        const description = 'display current queue';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases = ['q'];
        super(name, type, description, usage, aliases);
    }
    async execute_Interaction(
        interaction: Interaction
    ): Promise<CommandReturn> {
        return 'NOT_IMPLEMENTED';
    }
    async execute_Message(
        message: Message,
        args: string[]
    ): Promise<CommandReturn> {
        if (!message.guild) return 'NO_GUILD';
        const queue = guildManager
            .getGuild(message.guild.id)
            .musicPlayer.getQueue();
        if (queue.length === 0) {
            message.reply('The queue is empty');
            return 'SUCCESS';
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
        return 'SUCCESS';
    }
}
export class ToggleRandomPlayTrackCommand extends CommandBase {
    constructor() {
        const name = 'random';
        const type: CommandType = 'VOICE';
        const description = 'randomize queue';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases: string[] = [];
        super(name, type, description, usage, aliases);
    }
    async execute_Interaction(
        interaction: Interaction
    ): Promise<CommandReturn> {
        return 'NOT_IMPLEMENTED';
    }
    async execute_Message(
        message: Message,
        args: string[]
    ): Promise<CommandReturn> {
        if (!message.guild) return 'NO_GUILD';
        if (!(await isSameChannel(message.client, message.member!)))
            return 'NOT_SAME_CHANNEL';

        const queue = guildManager
            .getGuild(message.guild.id)
            .musicPlayer.getQueue();
        if (queue.length === 0) {
            message.reply('The queue is empty');
            return 'SUCCESS';
        }
        const state = guildManager
            .getGuild(message.guild.id)
            .musicPlayer.toggleRandomState();
        message.reply(`Random state is now ${state}`);
        return 'SUCCESS';
    }
}
export class ToggleLoopTrackCommand extends CommandBase {
    constructor() {
        const name = 'loopTrack';
        const type: CommandType = 'VOICE';
        const description = 'Toggle Loop Track State';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases: string[] = ['looptrack', 'lt', 'loopt'];
        super(name, type, description, usage, aliases);
    }
    async execute_Interaction(
        interaction: Interaction
    ): Promise<CommandReturn> {
        return 'NOT_IMPLEMENTED';
    }
    async execute_Message(
        message: Message,
        args: string[]
    ): Promise<CommandReturn> {
        if (!message.guild) return 'NO_GUILD';
        if (!(await isSameChannel(message.client, message.member!)))
            return 'NOT_SAME_CHANNEL';

        const queue = guildManager
            .getGuild(message.guild.id)
            .musicPlayer.getQueue();
        if (queue.length === 0) {
            message.reply('The queue is empty');
            return 'SUCCESS';
        }
        const musicPlayer = guildManager.getGuild(message.guild.id).musicPlayer;
        const state = musicPlayer.getPlayerState().loopState;
        if (state === 'SINGLE') {
            musicPlayer.setLoopState('NONE');
            message.reply('Loop state is now OFF');
        } else {
            musicPlayer.setLoopState('SINGLE');
            message.reply('Loop state is now Loop Track');
        }
        return 'SUCCESS';
    }
}
export class ToggleLoopQueueCommand extends CommandBase {
    constructor() {
        const name = 'loopQueue';
        const type: CommandType = 'VOICE';
        const description = 'Toggle Loop Queue State';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases: string[] = ['loopqueue', 'lq', 'loopq'];
        super(name, type, description, usage, aliases);
    }
    async execute_Interaction(
        interaction: Interaction
    ): Promise<CommandReturn> {
        return 'NOT_IMPLEMENTED';
    }
    async execute_Message(
        message: Message,
        args: string[]
    ): Promise<CommandReturn> {
        if (!message.guild) return 'NO_GUILD';
        if (!(await isSameChannel(message.client, message.member!)))
            return 'NOT_SAME_CHANNEL';

        const queue = guildManager
            .getGuild(message.guild.id)
            .musicPlayer.getQueue();
        if (queue.length === 0) {
            message.reply('The queue is empty');
            return 'SUCCESS';
        }
        const musicPlayer = guildManager.getGuild(message.guild.id).musicPlayer;
        const state = musicPlayer.getPlayerState().loopState;
        if (state === 'ALL') {
            musicPlayer.setLoopState('NONE');
            message.reply('Loop state is now OFF');
        } else {
            musicPlayer.setLoopState('ALL');
            message.reply('Loop state is now Loop Queue');
        }
        return 'SUCCESS';
    }
}
export class ToggleLoopCommand extends CommandBase {
    constructor() {
        const name = 'loop';
        const type: CommandType = 'VOICE';
        const description = 'Toggle Loop State';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases: string[] = [];
        super(name, type, description, usage, aliases);
    }
    async execute_Interaction(
        interaction: Interaction
    ): Promise<CommandReturn> {
        return 'NOT_IMPLEMENTED';
    }
    async execute_Message(
        message: Message,
        args: string[]
    ): Promise<CommandReturn> {
        if (!message.guild) return 'NO_GUILD';
        if (!(await isSameChannel(message.client, message.member!)))
            return 'NOT_SAME_CHANNEL';
        const queue = guildManager
            .getGuild(message.guild.id)
            .musicPlayer.getQueue();
        if (queue.length === 0) {
            message.reply('The queue is empty');
            return 'SUCCESS';
        }
        const musicPlayer = guildManager.getGuild(message.guild.id).musicPlayer;
        const state = musicPlayer.getPlayerState().loopState;
        if (state === 'ALL') {
            musicPlayer.setLoopState('NONE');
            message.reply('Loop state is now OFF');
        } else if (state === 'SINGLE') {
            musicPlayer.setLoopState('ALL');
            message.reply('Loop state is now Loop Queue');
        } else {
            musicPlayer.setLoopState('SINGLE');
            message.reply('Loop state is now Loop Track');
        }
        return 'SUCCESS';
    }
}

export class removeTrackCommand extends CommandBase {
    constructor() {
        const name = 'rm';
        const type: CommandType = 'VOICE';
        const description = 'remove a track from queue';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases: string[] = [];
        super(name, type, description, usage, aliases);
    }
    async execute_Interaction(
        interaction: Interaction
    ): Promise<CommandReturn> {
        return 'NOT_IMPLEMENTED';
    }
    async execute_Message(
        message: Message,
        args: string[]
    ): Promise<CommandReturn> {
        if (!message.guild) return 'NO_GUILD';
        if (!(await isSameChannel(message.client, message.member!)))
            return 'NOT_SAME_CHANNEL';
        if (args === undefined || args.length === 0 || isNaN(Number(args[0]))) {
            return 'INVALID_USAGE';
        }
        const queue = guildManager
            .getGuild(message.guild.id)
            .musicPlayer.getQueue();
        if (queue.length === 0) {
            message.reply('The queue is empty');
            return 'SUCCESS';
        }
        const musicPlayer = guildManager.getGuild(message.guild.id).musicPlayer;
        if (!musicPlayer.removeFromQueue(Number(args[0]))) {
            message.reply('Invalid index');
            return 'INVALID_USAGE';
        }
        return 'SUCCESS';
    }
}
export class playQueueTrackCommand extends CommandBase {
    constructor() {
        const name = 'pqt';
        const type: CommandType = 'VOICE';
        const description = 'play a track from queue by index';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases: string[] = [];
        super(name, type, description, usage, aliases);
    }
    async execute_Interaction(
        interaction: Interaction
    ): Promise<CommandReturn> {
        return 'NOT_IMPLEMENTED';
    }
    async execute_Message(
        message: Message,
        args: string[]
    ): Promise<CommandReturn> {
        if (!message.guild) return 'NO_GUILD';
        if (!(await isSameChannel(message.client, message.member!)))
            return 'NOT_SAME_CHANNEL';
        if (args === undefined || args.length === 0 || isNaN(Number(args[0]))) {
            return 'INVALID_USAGE';
        }
        const queue = guildManager
            .getGuild(message.guild.id)
            .musicPlayer.getQueue();
        if (queue.length === 0) {
            message.reply('The queue is empty');
            return 'SUCCESS';
        }
        const musicPlayer = guildManager.getGuild(message.guild.id).musicPlayer;
        if (!musicPlayer.playTrack(Number(args[0]))) {
            message.reply('Invalid index');
            return 'INVALID_USAGE';
        }
        return 'SUCCESS';
    }
}
export class seekTrackCommand extends CommandBase {
    constructor() {
        const name = 'seek';
        const type: CommandType = 'VOICE';
        const description = 'seek to a position in the current track';
        const usage = new CommandUsageBuilder(name)
            .allowText()
            .allowGuild()
            .build();
        const aliases: string[] = [];
        super(name, type, description, usage, aliases);
    }
    async execute_Interaction(
        interaction: Interaction
    ): Promise<CommandReturn> {
        return 'NOT_IMPLEMENTED';
    }
    async execute_Message(
        message: Message,
        args: string[]
    ): Promise<CommandReturn> {
        if (!message.guild) return 'NO_GUILD';
        if (!(await isSameChannel(message.client, message.member!)))
            return 'NOT_SAME_CHANNEL';
        if (args === undefined || args.length === 0 || isNaN(Number(args[0]))) {
            return 'INVALID_USAGE';
        }
        message.reply(
            'Seeking is not available due to youtube inconsistencies'
        );
        return 'NOT_IMPLEMENTED';
        // const queue = guildManager
        //     .getGuild(message.guild.id)
        //     .musicPlayer.getQueue();
        // if (queue.length === 0) {
        //     message.reply('The queue is empty');
        //     return true;
        // }
        // const musicPlayer = guildManager.getGuild(message.guild.id).musicPlayer;
        // if (!musicPlayer.seekTo(Number(args[0]) * 1000)) {
        //     message.reply('Invalid time, format: seconds');
        //     return true;
        // }
        // return true;
    }
}
