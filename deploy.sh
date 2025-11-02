echo "Starting deployment..."
cd /home/ubuntu/shami-2
git pull origin main
cp -r shabnam-backend/* shabnam-backend/
cp -r shabnam-overseas/* shabnam-overseas/
cd shabnam-backend
npm install
npm run build
cd ../shabnam-overseas
npm install
npm run build
pm2 restart all
echo "Deployment completed successfully!"
