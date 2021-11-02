# Command List
### All command has to be started with ```PREFIX``` or Guild Stated PREFIX e.g. ```PREFIX [command] [...args]```
## help
* Provide a link to the helpList Website (This repository file by default)
* Related Function ```helpFunction```
## changeprefix
* Change the prefix of bot commands (Does not save after restart or crashes) (To change the default prefix, edit the PREFIX in config.json instead)
* Related Function ```server_ChangePrefixFunction```
## clear
* clears the queue
* Related Function ```player_ClearFunction```
## join , connect
* join the current Voice Channel that the command issuer is on
* Related Function ```player_ConnectFunction```
## invite
* provide invite link of the bot
* Related Function ```inviteFunction```
## leave , disconnect
* leave the current voice channel and clear the queue
* Related Function ```player_DisconnectFunction```
## loop , loopq
* Toggle loop the current sound track or loop the current queue (Either on of them can be on at the same time)
* Related Function ```player_LoopFunction``` and ```player_LoopQueueFunction```
## np
* display the current sound track (unimplemented: time remaining etc.)
* Related Function ```player_NowPlayingFunction```
## play, p [string / url]
* Play the sound track searched on youtube (playlist not fully supported)
* Related Function ```player_PlayFunction```
## pause , resume
* pause or resume the player
* Related Function ```player_PauseFunction``` and ```player_ResumeFunction```
## queue , q
* Reply the current queue
* Related Function ```player_ListQueueFunction```
## resetprefix (Uses Default Prefix)
* Reset Prefix to default
* Related Function ```server_ResetPrefixFunction```
## remove , rm [index]
* remove a sound track from queue based on index of track in the queue
* Related Function ```player_RemoveFromListFunction```
## skip
* skip the current track
* Related Function ```player_SkipFunction```
## seek
* Work in progress, Unimplemented command
* Related Function ```player_SeekFunction```
## shuffle
* Work in progress, Unimplemented command
* Related Function ```player_ShuffleFunction``` 





