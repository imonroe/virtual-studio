#!/bin/sh

# Set default port if not provided
export PORT=${PORT:-80}

# Replace placeholder in nginx config template with actual port
envsubst '${PORT}' < /etc/nginx/conf.d/nginx-template.conf > /etc/nginx/conf.d/default.conf

# Remove template file
rm /etc/nginx/conf.d/nginx-template.conf

# Start nginx
nginx -g "daemon off;"