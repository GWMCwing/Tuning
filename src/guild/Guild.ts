import { Guild, GuildMember, User } from "discord.js";
import {PREFIX} from "../config.json";

interface GuildConfig{
    prefix: string;
    // other properties for other functions, or config options for functions
}

export class GuildProperty{
    constructor(id:string){
        this._id = id;
        this._GuildConfig = {prefix:PREFIX};
    }
    // no setter for _id and _GuildConfig
    get id():string{return this._id;}
    get GuildConfig():GuildConfig{return this._GuildConfig;}
    private _id:string;
    private _GuildConfig: GuildConfig;
}

class GuildManager{
    constructor(){
        this._guilds = new Map<string, GuildProperty>();
    }
    getGuild(id:string):GuildProperty{
        if(this._guilds.has(id)){
            return this._guilds.get(id)!;
        }else{
            const guild = new GuildProperty(id);
            this._guilds.set(id, guild);
            return guild;
        }
    }
    private _guilds:Map<string, GuildProperty>;
}

export async function getGuildUser(guild:Guild, id:string):Promise<GuildMember | null>{
    return await guild.members.fetch(id);
}

export const guildManager: GuildManager = new GuildManager();