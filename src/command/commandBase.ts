import { Interaction, Message } from 'discord.js';
import { logger } from '../util/logger';

export interface CommandUsage {
    usage: number;
}

export type CommandType = 'GENERAL' | 'MUSIC' | 'VOICE';

export class CommandUsageBuilder {
    // class for perform bit wise command usage handling
    // slash command on server, user, text command server, user
    // 0b00000 = 0 = no command
    // 0b00001 = 1 = text command
    // 0b00010 = 2 = slash command
    // 0b00100 = 4 = user command
    // 0b01000 = 8 = guild command
    private usage: number = 0;
    private commandName: string = '';
    constructor(name: string) {}
    allowText(): CommandUsageBuilder {
        this.usage |= 1;
        return this;
    }
    allowSlash(): CommandUsageBuilder {
        this.usage |= 2;
        return this;
    }
    allowUser(): CommandUsageBuilder {
        this.usage |= 4;
        return this;
    }
    allowGuild(): CommandUsageBuilder {
        this.usage |= 8;
        return this;
    }
    build(): CommandUsage {
        if (this.usage % 1 === 0 && (this.usage >> 1) % 1 === 0) {
            logger.warn(
                'CommandUsageBuilder',
                `Building Command *${this.commandName}* with no allowed calling usage`
            );
        }
        if ((this.usage >> 2) % 1 === 0 && (this.usage >> 3) % 1 === 0) {
            logger.warn(
                'CommandUsageBuilder',
                `Building Command *${this.commandName}* with no allowed calling scope`
            );
        }
        return { usage: this.usage } as CommandUsage;
    }
}

export abstract class CommandBase {
    name: string;
    description: string;
    usage: CommandUsage;
    type: CommandType;
    // _permission: CommandPermission;
    aliases: string[];
    // Map<name,description>
    requireArgs: Map<string, string>;
    // Map<name,description>
    optionalArgs: Map<string, string>;
    constructor(
        name: string,
        type: CommandType,
        description: string,
        usage: CommandUsage,
        aliases: string[]
    ) {
        this.name = name;
        this.description = description;
        this.usage = usage;
        this.type = type;
        this.aliases = aliases;
        this.requireArgs = new Map<string, string>();
        this.optionalArgs = new Map<string, string>();
    }
    //
    abstract execute_Interaction(interaction: Interaction): void;
    abstract execute_Message(message: Message, args: string[]): void;
}
