#!/bin/bash

# Exit on error
set -o errexit

echo "Starting build process..."

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Generate application key if not exists
if [ -z "$(grep APP_KEY .env)" ] || [ "$(grep APP_KEY .env | cut -d '=' -f2)" = "" ]; then
    php artisan key:generate --force
fi

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
php artisan migrate --force

# Clear caches
php artisan cache:clear
php artisan route:clear
php artisan config:clear

echo "Build completed successfully!"