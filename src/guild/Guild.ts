import { Guild, GuildMember } from 'discord.js';
import { PREFIX } from '../../config.json';
import { MusicPlayer } from '../feature/music/MusicPlayer';

interface GuildConfig {
    prefix: string;
    // other properties for other functions, or config options for functions
}

export class GuildProperty {
    constructor(id: string) {
        this._id = id;
        this._GuildConfig = { prefix: PREFIX };
        this._musicPlayer = new MusicPlayer(id);
    }
    // no setter for _id and _GuildConfig
    get id(): string {
        return this._id;
    }
    get GuildConfig(): GuildConfig {
        return this._GuildConfig;
    }
    get musicPlayer(): MusicPlayer {
        return this._musicPlayer;
    }
    private _id: string;
    private _GuildConfig: GuildConfig;
    private _musicPlayer: MusicPlayer;
}

class GuildManager {
    constructor() {
        this._guilds = new Map<string, GuildProperty>();
    }
    getGuild(id: string): GuildProperty {
        if (this._guilds.has(id)) {
            return this._guilds.get(id)!;
        } else {
            const guild = new GuildProperty(id);
            this._guilds.set(id, guild);
            return guild;
        }
    }

    private _guilds: Map<string, GuildProperty>;
}

export async function getGuildUser(
    guild: Guild,
    id: string
): Promise<GuildMember | null> {
    return await guild.members.fetch(id);
}

export const guildManager: GuildManager = new GuildManager();
