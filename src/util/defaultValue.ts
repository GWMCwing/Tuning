import { LogLevel as LogLevelType } from './app/logger';
// import { LogLevel, PREFIX, DefaultTimeout } from '../../config.json';
import { readFileSync } from 'fs';

let _DEFAULT_PREFIX: string = '$';
let _DEFAULT_LOG_LEVEL: LogLevelType = 'INFO';
let _DEFAULT_AUDIO_TIMEOUT: number = 1000 * 60 * 5;

function parseJsonConfig(): {
    PREFIX: string;
    LOG_LEVEL: LogLevelType;
    AUDIO_TIMEOUT: number;
} {
    console.log('Parsing config.json');
    //
    const config = JSON.parse(readFileSync('./config.json', 'utf8'));
    if (config.PREFIX?.toString().length > 0) {
        _DEFAULT_PREFIX = config.PREFIX.toString();
    } else {
        console.warn('Prefix is not valid, using default prefix');
    }
    //
    if (checkIfLogLevelIsValid(config.LogLevel)) {
        _DEFAULT_LOG_LEVEL = config.LogLevel as LogLevelType;
    } else {
        console.warn('Config', 'Invalid LogLevel in config.json');
    }
    //
    if (Number(config.DefaultTimeout)) {
        _DEFAULT_AUDIO_TIMEOUT = Number(config.DefaultTimeout);
    } else {
        console.warn('Config', 'Invalid DefaultTimeout in config.json');
    }
    console.log('Parsed config.json');
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
