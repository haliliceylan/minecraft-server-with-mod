#!/bin/bash
file="http.txt"
while IFS= read -r line
do
    wget --content-disposition -Phttp/ $line
done <"$file"
