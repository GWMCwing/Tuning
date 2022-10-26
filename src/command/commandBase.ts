import { Message } from "discord.js";
import { logger } from "../util/logger";

interface CommandUsage{
    usage: number;
}

class CommandUsageBuilder {
    // class for perform bit wise command usage handling
    // slash command on server, user, text command server, user
    // 0b00000 = 0 = no command
    // 0b00001 = 1 = text command
    // 0b00010 = 2 = slash command
    // 0b00100 = 4 = user command
    // 0b01000 = 8 = guild command
    private usage: number = 0;
    private commandName:  string = '';
    constructor(name: string){
        this.commandName = name;
    }
    allowText():void{
        this.usage |= 1;
    }
    allowSlash():void{
        this.usage |= 2;
    }
    allowUser():void{
        this.usage |= 4;
    }
    allowGuild():void{
        this.usage |= 8;
    }
    build():CommandUsage{
        if(this.usage % 1 === 0 && (this.usage >> 1)%1 === 0){
            logger.warn('CommandUsageBuilder', `Building Command *${this.commandName}* with no allowed calling usage`);
        }
        if((this.usage >> 2) % 1 === 0 && (this.usage >> 3) % 1 === 0){
            logger.warn('CommandUsageBuilder', `Building Command *${this.commandName}* with no allowed calling scope`);
        }
        return {usage: this.usage} as CommandUsage;
    }
}
export abstract class CommandBase {
    protected abstract _name : string;
    protected abstract _permission : CommandUsage;
    protected abstract _function : Function;
    // 
    set name(_name:string) { this._name = _name}
    get name():string { return this._name; }
    set permission(_permission:CommandUsage) { this._permission = _permission}
    get permission():CommandUsage { return this._permission; }
    set function(_function:Function) { this._function = _function}
    get function():Function { return this._function; }
    // 
    abstract execute(message:Message, args:string) : void;
}
