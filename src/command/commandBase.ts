import { Message } from "discord.js";

class CommandUsage {
    // class for perform bit wise command usage handling
    // slash command on server, user, text command server, user
}
export class CommandBase {
    private name : string;
    private permission : CommandUsage;
    private function : Function;
    setName(name:string) :CommandBase{ this.name = name; return this;}
    getName():string { return this.name; }
    execute(message:Message, args:string) : void{}
    constructor() {
        this.name = "";
        this.permission = new CommandUsage();
        this.function = () => {};
    }
}
