FROM itzg/minecraft-server:latest

ENV EULA=TRUE \
    VERSION=1.12.2 \
    TYPE=FORGE \
    FORGEVERSION=14.23.5.2847 \
    ONLINE_MODE=FALSE

WORKDIR /setup
COPY setup .
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN ./download-mods.sh
WORKDIR /data
ENTRYPOINT [ "sh", "/docker-entrypoint.sh" ]