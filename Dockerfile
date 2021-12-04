FROM itzg/minecraft-server:java8

ENV EULA=TRUE \
    VERSION=1.12.2 \
    TYPE=FORGE \
    ONLINE_MODE=FALSE \
    MEMORY=4.5G \
    JVM_DD_OPTS="-Dfml.readTimeout=90 -Ddeployment.trace=true -Ddeployment.log=true -Ddeployment.trace.level=all" \
    JVM_XX_OPTS="-XX:+AggressiveOpts -XX:ParallelGCThreads=3 -XX:+UseConcMarkSweepGC -XX:+UnlockExperimentalVMOptions -XX:+UseParNewGC -XX:+ExplicitGCInvokesConcurrent -XX:MaxGCPauseMillis=10 -XX:GCPauseIntervalMillis=50 -XX:+UseFastAccessorMethods -XX:+OptimizeStringConcat -XX:NewSize=84m -XX:+UseAdaptiveGCBoundary -XX:NewRatio=3"
RUN apk add --no-cache -U zip npm
RUN npm install --silent -g http-server
RUN touch /first-start
COPY docker-entrypoint.sh /docker-entrypoint.sh
WORKDIR /setup
COPY setup .
RUN ./download-http.sh
WORKDIR /mod-search
COPY mod-search .
RUN rm package-lock.json
RUN npm install
RUN node search.js
WORKDIR /data
ENTRYPOINT [ "sh", "/docker-entrypoint.sh" ]

EXPOSE 25566
