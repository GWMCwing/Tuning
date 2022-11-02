import {
    ActivityType,
    Client,
    ClientOptions,
    Events,
    GatewayIntentBits,
} from 'discord.js';
import { inputHandler } from './command/inputHandler';
import { TOKEN } from '../config.json';
import { logger } from './util/logger';
import { cliInputHandler } from './cli/cli';

const clientIntent: ClientOptions = {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
    ],
};
cliInputHandler.startHandlingCLIInput();
const client = new Client(clientIntent);
//
//
client.once(Events.ClientReady, async (c) => {
    logger.log('Client', 'Client is ready');
    client.user?.setPresence({
        activities: [
            {
                name: 'Migrating to Discord.js v14 and Typescript',
                type: ActivityType.Playing,
                url: 'https://github.com/GWMCwing/AuditBot',
            },
        ],
        status: 'online',
    });
});

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    logger.log('Client', `Message received: ${message.content}`);
    inputHandler(message);
});

client.login(TOKEN);
