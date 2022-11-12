import { Interaction, Message } from 'discord.js';
import { logger } from '../util/app/logger';
import { CommandBase, CommandType } from './commandBase';
// import all commands here
import { loadAllCommands } from './allCommand';
import { guildManager } from '../guild/Guild';
import { DEFAULT_PREFIX } from '../util/defaultValue';
//
class CommandManager {
    constructor() {
        logger.debug('CommandManager', 'Initializing command manager');
        if (CommandManager._instance) {
            return CommandManager._instance;
        }
        CommandManager._instance = this;
    }
    getCommand(name: string): CommandBase | null {
        return this.commands.get(name) || null;
    }
    async setCommand(command: CommandBase): Promise<void> {
        const nameList = [command.name, ...command.aliases];
        const nameListLength = nameList.length;
        const registeredList = [];
        logger.debug('CommandManager', `Registering command *${command.name}*`);
        for (let i = 0; i < nameListLength; i++) {
            const name = nameList[i];
            if (this.commands.has(name)) {
                if (i == 0) {
                    logger.warn(
                        'CommandManager',
                        `Command *${name}* already registered, skipping registration for this command`
                    );
                    break;
                }
                logger.warn(
                    'CommandManager',
                    `Command ${command.name} with alias *${name}* already registered, skipping alias`
                );
                continue;
            }
            registeredList.push(name);
            this.commands.set(name, command);
        }
        logger.debug(
            'CommandManager',
            `Registered command *${
                command.name
            }* with aliases ${registeredList.join(
                ', '
            )}, total registered commands: ${registeredList.length}`
        );
    }
    private static _instance: CommandManager;
    private commands: Map<string, CommandBase> = new Map<string, CommandBase>();
}

function parseCommand(commandName: string): CommandBase | null {
    const command = commandManager.getCommand(commandName);
    if (command) {
        return command;
    }
    return null;
}

function inputHandler_text(message: Message): void {
    let prefix: string = DEFAULT_PREFIX;
    if (message.guildId) {
        prefix = guildManager.getGuild(message.guildId).GuildConfig.prefix;
    }
    if (message.content.startsWith(prefix)) {
        const input = message.content.substring(prefix.length);
        const commandName = input.split(' ')[0];
        const args = input.split(' ').slice(1);
        logger.log(
            'InputHandler',
            `Command: ${commandName}, Args: ${args.join(',')}`
        );
        //
        const command = parseCommand(commandName);
        if (command) {
            if (command.type == 'VOICE' && message.guildId) {
                guildManager
                    .getGuild(message.guildId)
                    .updateAudioLastActive(message.client);
            }
            command.execute_Message(message, args);
        } else {
            message.reply(`Command ${commandName} not found`);
        }
    }
}

function inputHandler_interaction(interaction: Interaction): void {
    if (!interaction.isChatInputCommand()) return;
    const commandName = interaction.commandName;
    const args = interaction.options.data;
    logger.log(
        'InputHandler',
        `Interaction: ${commandName}, Args: ${args.join(',')}`
    );
    //
    const command = parseCommand(commandName);
    if (command && command.usage.usage & 2) {
        command.execute_Interaction(interaction);
    } else {
        interaction.reply(`Command ${commandName} not found or is disabled`);
    }
}

export function inputHandler(message: Message | Interaction): void {
    if (message instanceof Message) {
        inputHandler_text(message);
    } else {
        inputHandler_interaction(message);
    }
}

export const commandManager = new CommandManager();
loadAllCommands();
