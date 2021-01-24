test -f "/first-start" && (mkdir -p /data/mods && rm -rf /data/mods/*.jar; cp -rf /mod-search/mods/*.jar /data/mods/; rm -rf /first-start)
test -f "/setup/http/mods.zip" && rm -rf /setup/http/mods.zip
test -d "/setup/http/" && rm -rf /setup/http/*.jar
cp -rf /data/mods /setup/http/mods/
zip /setup/http/mods.zip /data/mods/*
chown -R minecraft:minecraft /data
( while true;do nohup http-server /setup/http --port 25566;done &>/dev/null & )
if [ -f "/data/debug" ]; then
    /setup/idle.sh
else 
    /start
fi
