import { Interaction, Message } from "discord.js";
import { logger } from "../util/logger";
import {PREFIX} from "../config.json";
import { CommandBase } from "./commandBase";
// import all commands here

interface CommandMap{
    [key:string]: CommandBase;
}

const commandMap:CommandMap = {};

function generateCommandMap(){
    
}

function parseCommand(commandName:string):CommandBase|null{
    const command = commandMap[commandName];
    if(command){
        return command;
    }else{
        return null;
    }
}

function inputHandler_text(message:Message) : void{
    if(message.content.startsWith(PREFIX)){
        const input = message.content.substring(PREFIX.length);
        const commandName = input.split(' ')[0];
        const args = input.substring(commandName.length).trim();
        logger.log('InputHandler', `Command: ${commandName}, Args: ${args}`);
        // 
        const command = parseCommand(commandName);
        if(command){
            command.execute(message, args);
        }else{
            message.reply(`Command ${commandName} not found`);
        }
    }
}

function inputHandler_interaction(interaction:Interaction) : void{

}

export function inputHandler(message:Message|Interaction) : void{
    if(message instanceof Message){
        inputHandler_text(message);
    } else{
        inputHandler_interaction(message);
    }
}