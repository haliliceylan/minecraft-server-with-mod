cp -rf /setup/data/* /data
chown -R minecraft:minecraft /data
( cd /setup/http && while true;do python3 -m http.server 25566;done >/dev/null & )
/start