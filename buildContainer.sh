#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}\n\t==============================================="
echo -e "\t\tStop, rebuild and run container"
echo -e "\t===============================================${NC}\n"

read -p "Container Name > " -r containername

echo -e "\n${GREEN}==> Stopping container${NC} $containername ${GREEN}...${NC}\n"
sudo docker stop $containername

echo -e "\n${GREEN}==>Remove stopped containers...${NC}\n"
sudo docker container prune -f

echo -e "\n${GREEN}==>Build container...${NC}\n"
sudo docker build -t nodemqclient .

#echo -e "\n${GREEN}==>Run container...${NC}\n"
#sudo docker run -d -e EXT_CERT="*********CERT************" -e EXT_KEY="===========KEY============" --name $containername -p 8080:8080 -p 8443:8443 nginx-alpine-proxy

#sudo docker run \
#  --name nodemq 
#  --detach \
#  nodemqclient

#sudo docker run -d --name $containername mqclient

#sudo docker run -e EXT_CERT -d --name $containername -p 8080:8080 -p 8443:8443 nginx-alpine-proxy
#sudo docker run --name $containername -p 8080:8080 -p 8443:8443 nginx-alpine-proxy
