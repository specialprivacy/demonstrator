#!/bin/bash

echo 'starting events producer'
echo ' to produce type messages here followed by a newline'
echo ' for instance \"my message\"'

docker-compose exec kafka kafka-console-producer.sh --broker-list kafka:9092 --topic application-logs
