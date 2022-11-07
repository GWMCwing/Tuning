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
    AudioPlayerStatus,
    AudioPlayerIdleState,
    AudioPlayerPausedState,
} from '@discordjs/voice';
import { PresenceManager } from 'discord.js';
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

const getTrackIndexGenerator = trackIndexGenerator();

export class MusicPlayer {
    //
    constructor(guildId: string, config?: MusicPlayerConfig) {
        this.guildId = guildId;
        if (config) this.config = config;
        else this.config = {};
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
        this.destroyTrack();
        return this.audioPlayer.stop();
    }
    pause(): boolean {
        return this.audioPlayer.pause();
    }
    resume(): boolean {
        return this.audioPlayer.unpause();
    }
    play(): boolean {
        logger.debug('player', 'status: ' + this.audioPlayer.state.status);
        if (
            this.audioPlayer.state.status === AudioPlayerStatus.Idle ||
            this.audioPlayer.state.status === AudioPlayerStatus.Paused ||
            this.audioPlayer.state.status === AudioPlayerStatus.AutoPaused
        ) {
            this.playNextAudioTrack();
            return true;
        }
        // TODO handle auto pause (no subscriber)
        if (this.audioPlayer.state.status === AudioPlayerStatus.Playing) {
            return true;
        }
        return false;
    }
    async playNext(): Promise<boolean> {
        return (await this.playNextAudioTrack()) === 'NONE';
    }
    async playPrevious(): Promise<boolean> {
        return (await this.playPreviousAudioTrack()) === 'NONE';
    }
    //
    setLoopState(state: LoopState): void {
        this.loopState = state;
    }
    toggleLoopState(): LoopState {
        this.loopState =
            this.loopState === 'NONE'
                ? 'SINGLE'
                : this.loopState === 'SINGLE'
                ? 'ALL'
                : 'NONE';
        return this.loopState;
    }
    setRandomState(state: boolean): void {
        this.randomState = state;
    }
    toggleRandomState(): boolean {
        this.randomState = !this.randomState;
        return this.randomState;
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
    // TODO implement command
    removeFromQueue(index: number): boolean {
        const id = this.queueIndex[index];
        if (id) {
            this.queue.delete(id);
            this.queueIndex.splice(index, 1);
            return true;
        }
        return false;
    }
    playTrack(index: number): void {
        const id = this.queueIndex[index];
        if (id) {
            this.playSpecificAudioTrack(id);
        }
    }
    seekTo(position: number): void {
        const id = this.queueIndex[this.trackPlayingIndex];
        if (id) {
            this.playSpecificAudioTrack(id, position);
        }
    }
    // TODO end
    //

    getTrackInfo_ID(id: number): TrackInfo | undefined {
        return this.queue.get(id);
    }
    getTrackInfo_Index(index: number): TrackInfo | undefined {
        return this.queue.get(this.queueIndex[index]);
    }

    destroyTrack(): void {
        (this.trackStream as NodeJS.ReadStream)?.destroy();
    }
    //

    async addToQueue(url: string): Promise<TrackInfo[]> {
        url = url.trim();
        if (url === '') return [];
        switch (getLinkType(url)) {
            case 'YOUTUBE_VIDEO':
                const videoTrack = await getTrackInfoFromUrl_youtube_video(url);
                this.setToQueue(videoTrack.id, videoTrack);
                return [videoTrack];
            case 'YOUTUBE_PLAYLIST':
                const playlistTrack =
                    await getTrackInfoFromUrl_youtube_playList(url);
                for (let i = 0; i < playlistTrack.length; i++) {
                    this.setToQueue(playlistTrack[i].id, playlistTrack[i]);
                }
                return playlistTrack;
            default:
                const track = await getTrackInfoFromUrl_Default(url);
                if (track) {
                    this.setToQueue(track.id, track);
                    return [track];
                }
                return [];
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
        audioPlayer.on('error', (error) => {
            logger.error(
                'player',
                error.name,
                error.message,
                JSON.stringify(error.resource, null, 2),
                error.stack!
            );
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
        this.destroyTrack();
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
    private async playNextAudioTrack(seek: number = 0): Promise<PlayerError> {
        if (this.queue.size === 0) return 'NO_TRACK';
        this.trackPlayingIndex++;
        if (this.trackPlayingIndex >= this.queue.size) {
            this.audioPlayer.stop();
            return 'END_OF_PLAYLIST';
        }
        //
        return this.playSpecificAudioTrack(this.trackPlayingIndex, seek);
    }
    private async playPreviousAudioTrack(
        seek: number = 0
    ): Promise<PlayerError> {
        if (this.queue.size === 0) return 'NO_TRACK';
        this.trackPlayingIndex--;
        if (this.trackPlayingIndex < 0) {
            this.audioPlayer.stop();
            this.trackPlayingIndex = 0;
            return 'END_OF_PLAYLIST';
        }
        //
        return this.playSpecificAudioTrack(this.trackPlayingIndex, seek);
    }
    private async updateTrackIndex(): Promise<boolean> {
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
    private trackPlayingIndex: number = -1;
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
        thumbnail: info.videoDetails.thumbnails[0].url,
        channelName: info.videoDetails.author.name,
        channelUrl: info.videoDetails.author.channel_url,
        length: Number(info.videoDetails.lengthSeconds) * 1000,
        id: getTrackIndexGenerator.next().value,
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
            id: getTrackIndexGenerator.next().value,
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
            id: getTrackIndexGenerator.next().value,
            type: 'YOUTUBE_VIDEO',
        };
        return track;
    }
    return null;
}
//

function getLinkType(url: string): linkType {
    if (ytpl.validateID(url)) {
        return 'YOUTUBE_PLAYLIST';
    }
    if (ytdl.validateURL(url)) {
        return 'YOUTUBE_VIDEO';
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
                highWaterMark: 1 << 25,
            });
        default:
            return null;
    }
}

export interface MusicPlayerConfig {
    //
}
