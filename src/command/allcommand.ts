import { logger } from '../util/logger';
import { commandManager } from './inputHandler';
import {
    joinChannelCommand,
    leaveChannelCommand,
} from './voice/voiceBaseChannelCommand';
import {
    playTrackChannelCommand,
    displayQueueCommand,
    pauseTrackChannelCommand,
    previousTrackChannelCommand,
    resumeTrackChannelCommand,
    skipTrackChannelCommand,
    displayNowPlayingCommand,
} from './voice/music';

export async function loadAllCommands(): Promise<void> {
    logger.debug('CommandManager', 'Loading all commands');
    await Promise.all([
        commandManager.setCommand(new joinChannelCommand()),
        commandManager.setCommand(new leaveChannelCommand()),
        //
        commandManager.setCommand(new playTrackChannelCommand()),
        commandManager.setCommand(new displayQueueCommand()),
        commandManager.setCommand(new pauseTrackChannelCommand()),
        commandManager.setCommand(new previousTrackChannelCommand()),
        commandManager.setCommand(new resumeTrackChannelCommand()),
        commandManager.setCommand(new skipTrackChannelCommand()),
        commandManager.setCommand(new displayNowPlayingCommand()),
    ]);

    logger.debug('CommandManager', 'All commands Loaded');
}
