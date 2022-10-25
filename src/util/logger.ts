const dateTimeFormatter = new Intl.DateTimeFormat([], {
    timeZone: 'Asia/Hong_Kong',
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
});
// format [HH:mm:ss] [LABEL/TYPE] [MESSAGE]
class Logger{
    constructor(){}
    async debug(label:string, ...message:string[]) : Promise<void>{
        const prefix : string = this.getPrefix('DEBUG', label);
        console.debug(`${prefix} ${message.join(' ')}`);
    }
    async log(label:string, ...message:string[]): Promise<void>{
        const prefix : string = this.getPrefix('LOG', label);
        console.log(`${prefix} ${message.join(' ')}`);
    }
    async info(label:string, ...message:string[]): Promise<void>{
        const prefix : string = this.getPrefix('INFO', label);
        console.info(`${prefix} ${message.join(' ')}`);
    }
    async warn(label:string, ...message:string[]): Promise<void>{
        const prefix : string = this.getPrefix('WARN', label);
        console.warn(`${prefix} ${message.join(' ')}`);
    }
    async error(label:string, ...message:string[]): Promise<void>{
        const prefix : string = this.getPrefix('ERROR', label);
        console.error(`${prefix} ${message.join(' ')}`);
    }
    private getPrefix(type: "DEBUG" | "INFO" | "LOG" | "WARN" | "ERROR", label:string) : string{
        return `[${dateTimeFormatter.format(new Date())}] [${label}/${type.toUpperCase()}]`;
    }
}
export const logger = new Logger();
