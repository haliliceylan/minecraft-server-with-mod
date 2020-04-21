cp -rf /setup/data/* /data
chown -R minecraft:minecraft /data
( cd /setup/http && python3 -m http.server 25566 >/dev/null & )
/start