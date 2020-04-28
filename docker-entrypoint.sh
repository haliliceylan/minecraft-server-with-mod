test -f "/first-start" && (rm -rf /data/mods/*.jar; cp -rf /setup/data/* /data; rm -rf /first-start)
test -f "/setup/http/mods.zip" && rm -rf /setup/http/mods.zip
test -d "/setup/http/" && rm -rf /setup/http/
cp -rf /data/mods /setup/http/
chown -R minecraft:minecraft /data
( while true;do nohup http-server /setup/http --port 25566;done &>/dev/null & )
if [ -f "/data/debug" ]; then
    /setup/idle.sh
else 
    /start
fi
