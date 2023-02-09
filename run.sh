#!/bin/sh

# Set default port 80 if environment variable is not defined
PORT=${PORT:-80}

cat /etc/nginx/conf.d/default.conf.template | sed "s/VAR_PORT/$PORT/" > /etc/nginx/conf.d/default.conf

nginx -g "daemon off;"
