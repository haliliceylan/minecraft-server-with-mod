cp -rf /setup/data/* /data
chown -R minecraft:minecraft /data
( while true;do nohup http-server /setup/http --port 25566;done &>/dev/null & )
/start