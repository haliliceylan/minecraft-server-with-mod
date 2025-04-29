# minecraft-server-with-mod

# SETUP
run these commands

`docker volume create mc-mod`

`docker run -it --name mc-mod -v "mc-mod:/data" -d -p "25566:25566" -p "25565:25565" haliliceylan/minecraft-server-with-mod:latest`

# UPDATE

`docker pull haliliceylan/minecraft-server-with-mod:latest`

`docker rm -f mc-mod`

`docker run -it --name mc-mod -v "mc-mod:/data" -d -p "25566:25566" -p "25565:25565" haliliceylan/minecraft-server-with-mod:latest`

[An Internal Link](/guides/content/editing-anssss-existing-page)
