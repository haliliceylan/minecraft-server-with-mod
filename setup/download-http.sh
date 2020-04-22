#!/bin/bash
file="http.txt"
while IFS= read -r line
do
    wget -Phttp/ $line
done <"$file"
