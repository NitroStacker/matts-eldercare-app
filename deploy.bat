@echo off
echo Building web version of Matt's Eldercare App...
npx expo export:web

echo Deploying to Firebase Hosting...
firebase deploy --only hosting

echo Deployment complete!
pause
