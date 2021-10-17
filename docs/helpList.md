# Command List
### All command has to be started with ```PREFIX``` or Guild Stated PREFIX e.g. ```PREFIX [command] [...args]```
## help
* Provide helpList Website (This repository file by default)
* Related Function ```helpFunction```
## changeprefix
* Change the prefix of the server (Does not save after restart or crashes) (To change the default prefix, edit the PREFIX in config.json instead)
* Related Function ```changePrefixFunction```
## clear
* clear the queue
* Related Function ```player_ClearFunction```
## join , connect
* join the current server
* Related Function ```player_ConnectFunction```
## leave , disconnect
* leave the current server and clear the queue
* Related Function ```player_DisconnectFunction```
## loop , loopq
* Toggle loop the current sound track or loop the current queue (Either on of them can be on at the same time)
* Related Function ```player_LoopFunction``` and ```player_LoopQueueFunction```
## np
* display the current sound track 
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
* Related Function ```resetPrefixFunction```
## remove , rm [index]
* remove a sound track from queue based on index of track in the queue
* Related Function ```player_RemoveFromListFunction```
## skip
* skip the current track
* Related Function ```player_SkipFunction```
## seek
* Currently not supported
* Related Function ```player_SeekFunction```






