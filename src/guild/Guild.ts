import { getVoiceConnection, AudioPlayerStatus } from '@discordjs/voice';
import {
    Channel,
    ChannelType,
    Client,
    Guild,
    GuildMember,
    VoiceBasedChannel,
} from 'discord.js';
import { PREFIX } from '../../config.json';
import { MusicPlayer } from '../feature/music/MusicPlayer';
import { logger } from '../util/logger';

interface GuildConfig {
    prefix: string;
    // other properties for other functions, or config options for functions
    // audio
    defaultAudioTimeout: number;
}
function generateDefaultGuildConfig(): GuildConfig {
    return {
        prefix: PREFIX,
        defaultAudioTimeout: 1000 * 60 * 5,
    };
}

export class GuildHandler {
    constructor(id: string) {
        this._id = id;
        this._guildConfig = generateDefaultGuildConfig();
        this._musicPlayer = new MusicPlayer(id);
        this._audioLastActive = Date.now();
    }
    // no setter for _id and _GuildConfig
    get id(): string {
        return this._id;
    }
    get GuildConfig(): GuildConfig {
        return this._guildConfig;
    }
    get musicPlayer(): MusicPlayer {
        return this._musicPlayer;
    }
    get audioLastActive(): number {
        return this._audioLastActive;
    }
    updateAudioLastActive(client: Client): void {
        this._audioLastActive = Date.now();
        this.updateTimeout(client, this._guildConfig.defaultAudioTimeout);
    }

    private updateTimeout(client: Client, delay: number): void {
        if (this._audioTimeout) {
            clearTimeout(this._audioTimeout);
        }
        this._audioTimeout = setTimeout(() => {
            const playerState =
                this.musicPlayer.getPlayerState().playState.status;
            const leaveAbleStatus =
                playerState === AudioPlayerStatus.Idle ||
                playerState === AudioPlayerStatus.AutoPaused ||
                playerState === AudioPlayerStatus.Paused;
            if (
                this.getVoiceChannelMemberCount(client) == 0 ||
                (leaveAbleStatus && this._audioLastActive + delay < Date.now())
            ) {
                this.leaveVoiceChannel();
                this._musicPlayer.stop();
                return;
            }
            return this.updateTimeout(client, delay);
        }, delay);
    }
    leaveVoiceChannel(): void {
        getVoiceConnection(this._id)?.destroy();
        this._musicPlayer.stop();
    }
    getChannel(client: Client, id: string): Channel | null {
        const channel = client.channels.cache.get(id);
        return channel ? channel : null;
    }
    getVoiceChannel(client: Client): VoiceBasedChannel | null {
        const channelId = getVoiceConnection(this._id)?.joinConfig.channelId;
        if (!channelId) return null;
        const channel = this.getChannel(client, channelId);
        if (channel?.type === ChannelType.GuildVoice) {
            return channel;
        }
        return null;
    }
    getVoiceChannelMemberCount(
        client: Client,
        excludeBot: boolean = true
    ): number {
        const memberList = this.getVoiceChannel(client)?.members;
        if (!memberList) return 0;
        if (excludeBot) {
            let count = 0;
            for (const member of memberList.values()) {
                if (!member.user.bot) count++;
            }
            return count;
        }
        return memberList.size;
    }

    private _id: string;
    private _guildConfig: GuildConfig;
    private _musicPlayer: MusicPlayer;
    private _audioLastActive: number;
    private _audioTimeout: NodeJS.Timeout | null = null;
    private defaultAudioTimeoutTime = 1000 * 60 * 15;
}

class GuildManager {
    constructor() {
        this._guilds = new Map<string, GuildHandler>();
    }
    getGuild(id: string): GuildHandler {
        if (this._guilds.has(id)) {
            return this._guilds.get(id)!;
        } else {
            const guild = new GuildHandler(id);
            this._guilds.set(id, guild);
            return guild;
        }
    }

    private _guilds: Map<string, GuildHandler>;
}

export async function getGuildUser(
    guild: Guild,
    id: string
): Promise<GuildMember | null> {
    return await guild.members.fetch(id);
}

export const guildManager: GuildManager = new GuildManager();
