FROM node:16

COPY . /usr/src/auditbot

WORKDIR /usr/src/auditbot

RUN npm install --global --unsafe-perm forever
RUN npm install --global --unsafe-perm ffmpeg-static
RUN npm install discord.js
RUN npm install @discordjs/builders
RUN npm install @discordjs/rest
RUN npm install discord-api-types
RUN npm install yt-search
RUN npm install ytdl-core@latest
RUN npm install @discordjs/voice
RUN npm install libsodium-wrappers
RUN npm install @discordjs/opus
RUN npm install ffmpeg


CMD forever start app.js