import { Message } from "discord.js";

class CommandUsage {
    // class for perform bit wise command usage handling
    // slash command on server, user, text command server, user
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
