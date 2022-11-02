import { createInterface } from 'readline';
import { logger } from '../util/logger';
import { CliCommandBase } from './cliCommandBase';

class CliInputHandler {
    private static rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    static started = false;
    constructor() {
        CliInputHandler.rl.on('SIGINT', () => {
            CliInputHandler.rl.close();
            process.emit('SIGINT');
        });
    }

    async startHandlingCLIInput(): Promise<void> {
        if (!CliInputHandler.started) {
            CliInputHandler.started = true;
        }
        this.getCLIInput().then((input) => {
            logger.debug('CLIInputHandler', `Input: ${input}`);
            this.HandleCLIInput(input);
            setTimeout(() => this.startHandlingCLIInput(), 0);
        });
    }
    private async getCLIInput(): Promise<string> {
        return new Promise((resolve) => {
            CliInputHandler.rl.question('> ', (ans) => resolve(ans));
        });
    }
    private getCLICommand(input: string): CliCommandBase | null {
        return null;
    }
    private async HandleCLIInput(input: string): Promise<boolean> {
        const command = this.getCLICommand(input.split(' ')[0]);
        if (command) {
            return command.execute(input.split(' ').slice(1));
        }
        return false;
    }
}

export const cliInputHandler = new CliInputHandler();
