FROM itzg/minecraft-server:latest

ENV EULA=TRUE \
    VERSION=1.12.2 \
    TYPE=FORGE \
    FORGEVERSION=14.23.5.2847 \
    ONLINE_MODE=FALSE

RUN apk add --no-cache -U zip npm
RUN npm install --silent -g http-server
RUN touch /first-start
COPY docker-entrypoint.sh /docker-entrypoint.sh
WORKDIR /setup
COPY setup .
RUN ./download-http.sh
RUN ./download-mods.sh
WORKDIR /data
ENTRYPOINT [ "sh", "/docker-entrypoint.sh" ]

EXPOSE 25566