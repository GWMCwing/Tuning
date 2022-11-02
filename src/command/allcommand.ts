import { logger } from '../util/logger';
import { commandManager } from './inputHandler';
import {
    joinChannelCommand,
    leaveChannelCommand,
} from './voice/voiceBaseChannelCommand';
import {
    PlayTrackChannelCommand,
    DisplayQueueCommand,
    PauseTrackChannelCommand,
    PreviousTrackChannelCommand,
    ResumeTrackChannelCommand,
    SkipTrackChannelCommand,
    ToggleRandomPlayTrackCommand,
    ToggleLoopQueueCommand,
    ToggleLoopTrackCommand,
} from './voice/music';

export async function loadAllCommands(): Promise<void> {
    logger.info('CommandManager', 'Loading all commands');
    await Promise.all([
        commandManager.setCommand(new joinChannelCommand()),
        commandManager.setCommand(new leaveChannelCommand()),
        //
        commandManager.setCommand(new PlayTrackChannelCommand()),
        commandManager.setCommand(new DisplayQueueCommand()),
        commandManager.setCommand(new PauseTrackChannelCommand()),
        commandManager.setCommand(new PreviousTrackChannelCommand()),
        commandManager.setCommand(new ResumeTrackChannelCommand()),
        commandManager.setCommand(new SkipTrackChannelCommand()),
        commandManager.setCommand(new ToggleRandomPlayTrackCommand()),
        commandManager.setCommand(new ToggleLoopQueueCommand()),
        commandManager.setCommand(new ToggleLoopTrackCommand()),
    ]);
    logger.info('CommandManager', 'All commands Loaded');
}
