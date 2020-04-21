#!/bin/bash
file="mods.txt"
while IFS= read -r line
do
    wget -Pdata/mods/ $line
done <"$file"

zip http/mods.zip data/mods/*.jar