#!/bin/bash

echo "Starting deployment..."

# Navigate to project directory
cd /home/ubuntu/shami-2

# Pull latest changes from GitHub (this will pull into nested structure)
git pull origin main

# Copy files from nested structure to current working structure
cp -r shabnam-backend/* shabnam-backend/
cp -r shabnam-overseas/* shabnam-overseas/

# Install backend dependencies and rebuild
cd shabnam-backend
npm install
npm run build

# Install frontend dependencies and rebuild
cd ../shabnam-overseas
npm install
npm run build

# Restart applications with PM2
pm2 restart all

echo "Deployment completed successfully!"
