import { Client,ClientOptions, Events, GatewayIntentBits } from "discord.js";
import { inputHandler } from "./command/inputHandler";
import { TOKEN } from "./config.json";
import {logger} from "./util/logger";

const clientIntent : ClientOptions = {
    intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages, 
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.DirectMessages
    ]
}
const client = new Client(clientIntent);

client.once(Events.ClientReady, (c)=>{
    logger.log('Client', 'Client is ready');
});

client.on(Events.MessageCreate,(message)=>{
    logger.log('Client', `Message received: ${message.content}`);
    inputHandler(message);
})

client.login(TOKEN);