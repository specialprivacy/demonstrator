#!/bin/bash

echo 'starting events consumer'
echo 'the values of message that are being sent on the topic will show here:'

docker-compose exec kafka kafka-console-consumer.sh --bootstrap-server zookeeper:2181 --topic application-logs --from-beginning
