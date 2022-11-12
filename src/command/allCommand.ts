import { logger } from '../util/app/logger';
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
    ToggleLoopCommand,
    removeTrackCommand,
    playQueueTrackCommand,
    seekTrackCommand,
} from './voice/music';
import { helpCommand } from './common/help';

async function loadAllMusicCommands(): Promise<void[]> {
    logger.info('Loading music commands');
    return Promise.all([
        commandManager.setCommand(new PlayTrackChannelCommand()),
        commandManager.setCommand(new DisplayQueueCommand()),
        commandManager.setCommand(new PauseTrackChannelCommand()),
        //
        commandManager.setCommand(new PreviousTrackChannelCommand()),
        commandManager.setCommand(new ResumeTrackChannelCommand()),
        //
        commandManager.setCommand(new SkipTrackChannelCommand()),
        //
        commandManager.setCommand(new ToggleRandomPlayTrackCommand()),
        //
        commandManager.setCommand(new ToggleLoopQueueCommand()),
        commandManager.setCommand(new ToggleLoopTrackCommand()),
        commandManager.setCommand(new ToggleLoopCommand()),
        commandManager.setCommand(new removeTrackCommand()),
        commandManager.setCommand(new playQueueTrackCommand()),
        commandManager.setCommand(new seekTrackCommand()),
    ]);
}

export async function loadAllCommands(): Promise<void> {
    logger.info('CommandManager', 'Loading all commands');
    await Promise.all([
        commandManager.setCommand(new helpCommand()),
        //
        commandManager.setCommand(new joinChannelCommand()),
        commandManager.setCommand(new leaveChannelCommand()),
        //
        loadAllMusicCommands(),
    ]);
    logger.info('CommandManager', 'All commands Loaded');
}
