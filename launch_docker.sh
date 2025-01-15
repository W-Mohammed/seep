#!/bin/bash
docker-compose --env-file .env.prod up -d

# Sleep for 60 seconds
sleep 10

# Prune unused containers
# docker system prune -f
docker container prune -f