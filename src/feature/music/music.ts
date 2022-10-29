import ytdl from 'ytdl-core';
import { logger } from '../../util/logger';
const yts = require('yt-search');
//
interface TrackInfo {
    title: string;
    url: string;
    thumbnail: string;
    channelName: string;
    channelUrl: string;
    length: number;
    id: number;
    type: linkType;
}

export type LoopState = 'NONE' | 'SINGLE' | 'ALL';
export type PlayerState = 'IDLE' | 'PLAYING' | 'PAUSED' | 'STOPPED';

function* trackIndexGenerator(): IterableIterator<number> {
    let index = 0;
    while (true) {
        yield index++;
    }
}

export class MusicPlayer {
    private guildId: string;
    private config: MusicPlayerConfig;
    private playState: PlayerState = 'STOPPED';
    private loopState: LoopState = 'NONE';
    private randomState: boolean = false;
    private trackIndex: number = 0;
    private queue: Map<number, TrackInfo>;
    private queueIndex: number[];
    //
    constructor(guildId: string, config: MusicPlayerConfig) {
        this.guildId = guildId;
        this.config = config;
        this.queue = new Map();
        this.queueIndex = [];
    }
    //
    setToQueue(id: number, result: TrackInfo): void {
        this.queue.set(id, result);
        this.queueIndex.push(id);
    }
    async addToQueue(url: string): Promise<boolean> {
        switch (getLinkType(url)) {
            case 'YOUTUBE':
                const result = await getTrackInfoFromUrl_youtube(url);
                this.setToQueue(result.id, result);
                return true;
            default:
                const track = await getTrackInfoFromUrl_Default(url);
                if (track) {
                    this.setToQueue(track.id, track);
                    return true;
                }
                return false;
        }
    }
    // state control
    getPlayerState(): {
        playState: PlayerState;
        loopState: LoopState;
        randomState: boolean;
    } {
        return {
            playState: this.playState,
            loopState: this.loopState,
            randomState: this.randomState,
        };
    }
    stop(): boolean {
        if (this.playState === 'STOPPED') {
            return false;
        } else {
            this.playState = 'STOPPED';
            return true;
        }
    }
    pause(): boolean {
        if (this.playState === 'PAUSED') {
            return false;
        } else {
            this.playState = 'PAUSED';
            return true;
        }
    }
    resume(): boolean {
        if (this.playState === 'PLAYING') {
            return false;
        } else {
            this.playState = 'PLAYING';
            return true;
        }
    }
    playNext(): boolean {
        // TODO: implement
        return false;
    }
    playPrevious(): boolean {
        // TODO: implement
        return false;
    }
    //
    setLoopState(state: LoopState): void {
        this.loopState = state;
    }
    toggleLoopState(): void {
        this.loopState =
            this.loopState === 'NONE'
                ? 'SINGLE'
                : this.loopState === 'SINGLE'
                ? 'ALL'
                : 'NONE';
    }
    setRandomState(state: boolean): void {
        this.randomState = state;
    }
    toggleRandomState(): void {
        this.randomState = !this.randomState;
    }
    //
    getQueue(): Map<number, TrackInfo> {
        return this.queue;
    }
    getTrackInfo_ID(id: number): TrackInfo | undefined {
        return this.queue.get(id);
    }
    getTrackInfo_Index(index: number): TrackInfo | undefined {
        return this.queue.get(this.queueIndex[index]);
    }
}
//
async function getTrackInfoFromUrl_youtube(url: string): Promise<TrackInfo> {
    const info = await ytdl.getInfo(url);
    const track: TrackInfo = {
        title: info.videoDetails.title,
        url: info.videoDetails.video_url,
        thumbnail: info.videoDetails.thumbnail.thumbnails[0].url,
        channelName: info.videoDetails.author.name,
        channelUrl: info.videoDetails.author.channel_url,
        length: Number(info.videoDetails.lengthSeconds) * 1000,
        id: trackIndexGenerator().next().value,
        type: 'YOUTUBE',
    };
    return track;
}
async function getTrackInfoFromUrl_Default(
    url: string
): Promise<TrackInfo | null> {
    const result = await yts(url);
    if (result.videos.length > 0) {
        const video = result.videos[0];
        const track: TrackInfo = {
            title: video.title,
            url: video.url,
            thumbnail: video.thumbnail,
            channelName: video.author.name,
            channelUrl: video.author.url,
            length: Number(video.duration.seconds) * 1000,
            id: trackIndexGenerator().next().value,
            type: 'YOUTUBE',
        };
        return track;
    }
    return null;
}
//
type linkType = 'YOUTUBE' | 'UNKNOWN';

function getLinkType(url: string): linkType {
    if (ytdl.validateURL(url)) {
        return 'YOUTUBE';
    }
    return 'UNKNOWN';
}

function getAudioStream(
    track: TrackInfo,
    seekTime: number = 0
): NodeJS.ReadableStream | null {
    switch (track.type) {
        case 'YOUTUBE':
            return ytdl(track.url, {
                filter: 'audioonly',
                quality: 'highestaudio',
                range: { start: seekTime },
            });
        default:
            return null;
    }
}

export interface MusicPlayerConfig {
    //
}
