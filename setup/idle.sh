#!/bin/bash                                                                
                                                                           
echo "DEBUG MODE ENABLED"
echo "PLEASE DELETE /data/debug for disable"    
echo "This is a idle script (infinite loop) to keep container running."    
echo "Please use exec command to enter inside container"                                         
                                                                           
cleanup ()                                                                 
{                                                                          
  kill -s SIGTERM $!                                                         
  exit 0                                                                     
}                                                                          
                                                                           
trap cleanup SIGINT SIGTERM                                                
                                                                           
while [ 1 ]                                                                
do                                                                         
  sleep 60 &                                                             
  wait $!                                                                
done