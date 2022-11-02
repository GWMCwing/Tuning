export abstract class CliCommandBase {
    private name: string;
    private description: string;
    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
    abstract execute(args: string[]): boolean;
}
