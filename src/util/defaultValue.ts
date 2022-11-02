import { LogLevel as LogLevelType } from '../util/logger';
import { LogLevel, PREFIX, DefaultTimeout } from '../../config.json';

let _DEFAULT_PREFIX: string = '$';
let _DEFAULT_LOG_LEVEL: LogLevelType = 'INFO';
let _DEFAULT_AUDIO_TIMEOUT: number = 1000 * 60 * 5;

function parseJsonConfig(): {
    PREFIX: string;
    LOG_LEVEL: LogLevelType;
    AUDIO_TIMEOUT: number;
} {
    if (PREFIX?.toString().length > 0) {
        _DEFAULT_PREFIX = PREFIX.toString();
    } else {
        console.warn('Prefix is not valid, using default prefix');
    }
    //
    if (checkIfLogLevelIsValid(LogLevel)) {
        _DEFAULT_LOG_LEVEL = LogLevel as LogLevelType;
    } else {
        console.warn('Config', 'Invalid LogLevel in config.json');
    }
    //
    if (Number(DefaultTimeout)) {
        _DEFAULT_AUDIO_TIMEOUT = Number(DefaultTimeout);
    } else {
        console.warn('Config', 'Invalid DefaultTimeout in config.json');
    }
    //
    return {
        PREFIX: _DEFAULT_PREFIX,
        LOG_LEVEL: _DEFAULT_LOG_LEVEL,
        AUDIO_TIMEOUT: _DEFAULT_AUDIO_TIMEOUT,
    };
}
function checkIfLogLevelIsValid(LL: string) {
    if (
        LL === 'DEBUG' ||
        LL === 'INFO' ||
        LL === 'LOG' ||
        LL === 'WARN' ||
        LL === 'ERROR'
    ) {
        return true;
    }
    return false;
}

const config = parseJsonConfig();
export const DEFAULT_PREFIX = config.PREFIX;
export const DEFAULT_LOG_LEVEL = config.LOG_LEVEL;
export const DEFAULT_AUDIO_TIMEOUT = config.AUDIO_TIMEOUT;
