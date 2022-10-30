import ytdl from 'ytdl-core';
import { logger } from '../../util/logger';
import {
    createAudioPlayer,
    createAudioResource,
    AudioPlayer,
    AudioResource,
    StreamType,
    CreateAudioPlayerOptions,
    NoSubscriberBehavior,
    AudioPlayerState,
} from '@discordjs/voice';
const yts = require('yt-search');
const ytpl = require('ytpl');
//
export interface TrackInfo {
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
export type PlayerError = 'NONE' | 'NO_TRACK' | 'END_OF_PLAYLIST' | 'UNKNOWN';
type linkType = 'YOUTUBE_VIDEO' | 'YOUTUBE_PLAYLIST' | 'UNKNOWN';

const defaultAudioPlayerOption: CreateAudioPlayerOptions = {
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
    },
};

function* trackIndexGenerator(): IterableIterator<number> {
    let index = 0;
    while (true) {
        yield index++;
    }
}

export class MusicPlayer {
    //
    constructor(guildId: string, config: MusicPlayerConfig) {
        this.guildId = guildId;
        this.config = config;
        this.queue = new Map();
        this.queueIndex = [];
    }
    //
    // state control
    getPlayerState(): {
        playState: AudioPlayerState;
        loopState: LoopState;
        randomState: boolean;
    } {
        return {
            playState: this.audioPlayer.state,
            loopState: this.loopState,
            randomState: this.randomState,
        };
    }
    stop(): boolean {
        return this.audioPlayer.stop();
    }
    pause(): boolean {
        return this.audioPlayer.pause();
    }
    resume(): boolean {
        return this.audioPlayer.unpause();
    }
    playNext(): boolean {
        return this.playNextAudioTrack() === 'NONE';
    }
    playPrevious(): boolean {
        return this.playPreviousAudioTrack() === 'NONE';
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
    getPlayer(): AudioPlayer {
        return this.audioPlayer;
    }
    //
    getQueue(): TrackInfo[] {
        const result: TrackInfo[] = [];
        this.queue.forEach((value) => {
            result.push(value);
        });
        return result;
    }
    getTrackInfo_ID(id: number): TrackInfo | undefined {
        return this.queue.get(id);
    }
    getTrackInfo_Index(index: number): TrackInfo | undefined {
        return this.queue.get(this.queueIndex[index]);
    }
    //

    async addToQueue(url: string): Promise<number> {
        switch (getLinkType(url)) {
            case 'YOUTUBE_VIDEO':
                const videoTrack = await getTrackInfoFromUrl_youtube_video(url);
                this.setToQueue(videoTrack.id, videoTrack);
                return 1;
            case 'YOUTUBE_PLAYLIST':
                const playlistTrack =
                    await getTrackInfoFromUrl_youtube_playList(url);
                for (let i = 0; i < playlistTrack.length; i++) {
                    this.setToQueue(playlistTrack[i].id, playlistTrack[i]);
                }
                return playlistTrack.length;
            default:
                const track = await getTrackInfoFromUrl_Default(url);
                if (track) {
                    this.setToQueue(track.id, track);
                    return 1;
                }
                return 0;
        }
    }
    //
    //
    //
    //
    private createDiscordAudioPlayer(): AudioPlayer {
        const audioPlayer: AudioPlayer = createAudioPlayer(
            defaultAudioPlayerOption
        );
        audioPlayer.on('stateChange', (oldState, newState) => {
            if (newState.status === 'idle') {
                // end of track
                this.updateTrackIndex();
                this.playSpecificAudioTrack(this.trackPlayingIndex);
            }
        });
        return audioPlayer;
    }
    //
    private setToQueue(id: number, result: TrackInfo): void {
        this.queue.set(id, result);
        this.queueIndex.push(id);
    }
    private playSpecificAudioTrack(id: number, seek: number = 0): PlayerError {
        if (this.queue.size === 0) return 'NO_TRACK';
        //
        let track = this.getTrackInfo_ID(id);
        if (!track) track = this.getTrackInfo_Index(id);
        if (track) {
            this.trackStream = getAudioStream(track, seek);
            if (this.trackStream) {
                this.audioResource = createAudioResource(
                    this.trackStream as NodeJS.ReadStream,
                    {
                        inlineVolume: true,
                        // inputType: StreamType.OggOpus,
                    }
                );
                this.audioPlayer.play(this.audioResource);
            }
            return 'NONE';
        }
        return 'NO_TRACK';
    }
    private playNextAudioTrack(seek: number = 0): PlayerError {
        if (this.queue.size === 0) return 'NO_TRACK';
        this.trackPlayingIndex++;
        if (this.trackPlayingIndex >= this.queue.size) {
            this.trackPlayingIndex--;
            return 'END_OF_PLAYLIST';
        }
        //
        return this.playSpecificAudioTrack(this.trackPlayingIndex, seek);
    }
    private playPreviousAudioTrack(seek: number = 0): PlayerError {
        if (this.queue.size === 0) return 'NO_TRACK';
        this.trackPlayingIndex--;
        if (this.trackPlayingIndex < 0) {
            this.trackPlayingIndex++;
            return 'END_OF_PLAYLIST';
        }
        //
        return this.playSpecificAudioTrack(this.trackPlayingIndex, seek);
    }
    private updateTrackIndex(): boolean {
        if (this.randomState) {
            this.trackPlayingIndex = Math.floor(
                Math.random() * this.queue.size
            );
        } else if (this.loopState === 'SINGLE') {
            // do nothing
        } else if (this.loopState === 'ALL') {
            this.trackPlayingIndex =
                (this.trackPlayingIndex + 1) % this.queue.size;
        } else {
            this.trackPlayingIndex++;
            if (this.trackPlayingIndex >= this.queue.size) {
                this.trackPlayingIndex--;
                return false;
            }
        }
        return true;
    }
    //
    private guildId: string;
    private config: MusicPlayerConfig;
    private loopState: LoopState = 'NONE';
    private randomState: boolean = false;
    private trackPlayingIndex: number = 0;
    private trackStream: NodeJS.ReadableStream | null = null;
    private queue: Map<number, TrackInfo>;
    private queueIndex: number[];
    private lastUpdate: number = Date.now();
    //
    private audioPlayer: AudioPlayer = this.createDiscordAudioPlayer();
    private audioResource: AudioResource | null = null;
}
//
//
//
//
//
//
async function getTrackInfoFromUrl_youtube_video(
    url: string
): Promise<TrackInfo> {
    const info = await ytdl.getInfo(url);
    const track: TrackInfo = {
        title: info.videoDetails.title,
        url: info.videoDetails.video_url,
        thumbnail: info.videoDetails.thumbnail.thumbnails[0].url,
        channelName: info.videoDetails.author.name,
        channelUrl: info.videoDetails.author.channel_url,
        length: Number(info.videoDetails.lengthSeconds) * 1000,
        id: trackIndexGenerator().next().value,
        type: 'YOUTUBE_VIDEO',
    };
    return track;
}

async function getTrackInfoFromUrl_youtube_playList(
    url: string
): Promise<TrackInfo[]> {
    const playlist = await ytpl(url);
    const tracks: TrackInfo[] = [];
    for (let i = 0; i < playlist.items.length; i++) {
        const item = playlist.items[i];
        const track: TrackInfo = {
            title: item.title,
            url: item.url,
            thumbnail: item.thumbnails[0].url,
            channelName: item.author.name,
            channelUrl: item.author.url,
            length: Number(item.durationSec) * 1000,
            id: trackIndexGenerator().next().value,
            type: 'YOUTUBE_VIDEO',
        };
        tracks.push(track);
    }
    return tracks;
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
            type: 'YOUTUBE_VIDEO',
        };
        return track;
    }
    return null;
}
//

function getLinkType(url: string): linkType {
    if (ytdl.validateURL(url)) {
        return 'YOUTUBE_VIDEO';
    }
    if (ytpl.validateID(url)) {
        return 'YOUTUBE_PLAYLIST';
    }
    return 'UNKNOWN';
}

function getAudioStream(
    track: TrackInfo,
    seekTime: number = 0
): NodeJS.ReadableStream | null {
    switch (track.type) {
        case 'YOUTUBE_VIDEO':
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
