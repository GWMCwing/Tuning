import { getVoiceConnection } from '@discordjs/voice';
import { Guild, GuildMember } from 'discord.js';
import { PREFIX } from '../../config.json';
import { MusicPlayer } from '../feature/music/MusicPlayer';

interface GuildConfig {
    prefix: string;
    // other properties for other functions, or config options for functions
}

export class GuildHandler {
    constructor(id: string) {
        this._id = id;
        this._guildConfig = { prefix: PREFIX };
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
    updateAudioLastActive(): void {
        this._audioLastActive = Date.now();
        this.updateTimeout(1000 * 60 * 5);
    }

    private updateTimeout(delay: number): void {
        if (this._audioTimeout) {
            clearTimeout(this._audioTimeout);
        }
        this._audioTimeout = setTimeout(() => {
            this._musicPlayer.stop();
            this.leaveVoiceChannel();
        }, delay);
    }
    leaveVoiceChannel(): void {
        getVoiceConnection(this._id)?.destroy();
        this._musicPlayer.stop();
    }

    private _id: string;
    private _guildConfig: GuildConfig;
    private _musicPlayer: MusicPlayer;
    private _audioLastActive: number;
    private _audioTimeout: NodeJS.Timeout | null = null;
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
