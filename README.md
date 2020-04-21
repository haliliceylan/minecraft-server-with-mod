# minecraft-server-with-mod

# SETUP
create a folder and run this command in the folder

`docker run -it --name mc-mod -v "$PWD:/data" -d -p "25566:25566" -p "25565:25565" haliliceylan/minecraft-server-with-mod:latest`

# UPDATE

run this command in the folder which you have

`docker pull`
`docker rm -f mc-mod`
`docker run -it --name mc-mod -v "$PWD:/data" -d -p "25566:25566" -p "25565:25565" haliliceylan/minecraft-server-with-mod:latest`