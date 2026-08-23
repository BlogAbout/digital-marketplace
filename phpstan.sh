#!/bin/bash

docker-compose exec app vendor/bin/phpstan analyse \
    --memory-limit=1G \
    --no-progress \
    --error-format=table
