import {
    Guild,
    GuildMember,
    User,
    VoiceBasedChannel,
    VoiceState,
} from 'discord.js';
import { getGuildUser } from '../Guild';

export async function getUserVoiceChannel(
    user: GuildMember
): Promise<VoiceBasedChannel | null>;
export async function getUserVoiceChannel(
    user_id: string,
    guild: Guild
): Promise<VoiceBasedChannel | null>;
export async function getUserVoiceChannel(
    param1: GuildMember | string,
    guild?: Guild
): Promise<VoiceBasedChannel | null> {
    let user: GuildMember | null;
    if (param1 instanceof GuildMember && guild === undefined) {
        user = param1;
    } else if (typeof param1 === 'string' && guild) {
        user = await getGuildUser(guild, param1);
    } else {
        // impossible
        throw new Error('Invalid parameters');
    }
    if (user) return user.voice.channel;
    return null;
}

export async function getUserVoiceStatus(
    user: GuildMember
): Promise<VoiceState> {
    return user.voice;
}
