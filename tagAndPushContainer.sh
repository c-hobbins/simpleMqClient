#!/bin/bash
echo -e "Logging into Docker with AWS [ircc] credential binding...\n"
aws ecr --profile ircc get-login-password | sudo docker login --username AWS --password-stdin 313321313145.dkr.ecr.ca-central-1.amazonaws.com/ibmmq

echo -e "Tagging docker image...\n"
sudo docker tag nodemqclient:latest 313321313145.dkr.ecr.ca-central-1.amazonaws.com/nodemqclient:latest

echo -e "Pushing docker image...\n"
sudo docker push 313321313145.dkr.ecr.ca-central-1.amazonaws.com/nodemqclient:latest
