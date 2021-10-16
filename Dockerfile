FROM node:16

COPY . /usr/src/auditbot

WORKDIR /usr/src/auditbot

RUN npm install --global --unsafe-perm nodemon
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


CMD nodemon -x 'node app.js || (sleep 10; touch app.js)'