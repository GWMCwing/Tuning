import {
    ActivityType,
    Client,
    ClientOptions,
    Events,
    PermissionsBitField,
    GatewayIntentBits,
} from 'discord.js';
import { inputHandler } from './command/inputHandler';
import { TOKEN } from '../config.json';
import { logger } from './util/logger';

const clientIntent: ClientOptions = {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
    ],
};
const client = new Client(clientIntent);
//
//
client.once(Events.ClientReady, async (c) => {
    logger.log('Client', 'Client is ready');

    logger.log('Client', `Logged in as: ${client.user?.id}`)
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

client.on(Events.VoiceStateUpdate,async (oldVoiceState, newVoiceState) => {
    logger.log('Client', `VoiceStateUpdate received: ${newVoiceState.member}`)
    if (client.user?.id === newVoiceState.member?.id){
        logger.log('Client', `The bot's VoiceState is updated:`)
        logger.log('Client', `serverDeaf: ${oldVoiceState.serverDeaf} -> ${newVoiceState.serverDeaf}`)
        if (newVoiceState.serverDeaf === false){
            if(newVoiceState.guild.members.me?.permissions.has(PermissionsBitField.Flags.DeafenMembers)){
                newVoiceState.guild.members.me?.voice.setDeaf(true)
            }
            
        }
        logger.log('Client', `serverMute: ${oldVoiceState.serverMute} -> ${newVoiceState.serverMute}`)
        if (newVoiceState.serverMute === true){
            if(newVoiceState.guild.members.me?.permissions.has(PermissionsBitField.Flags.MuteMembers)){
                newVoiceState.guild.members.me?.voice.setMute(false)
            }
            
        }
    }
});

client.login(TOKEN);
