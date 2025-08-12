# GitHub Repository & Firebase Hosting Setup Guide

This guide will help you set up your eldercare app as a GitHub repository and deploy it to Firebase Hosting.

## 🚀 Step 1: Create GitHub Repository

1. **Go to GitHub.com** and sign in to your account
2. **Click "New repository"** (green button)
3. **Repository name**: `matts-eldercare-app`
4. **Description**: `A comprehensive eldercare management application`
5. **Make it Public** (or Private if you prefer)
6. **Don't initialize** with README (we already have one)
7. **Click "Create repository"**

## 🔗 Step 2: Connect Local Repository to GitHub

Run these commands in your project directory:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/matts-eldercare-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🔥 Step 3: Set Up Firebase Hosting

### 3.1 Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 3.2 Login to Firebase

```bash
firebase login
```

### 3.3 Initialize Firebase in Your Project

```bash
firebase init hosting
```

When prompted:
- **Select your project**: Choose your existing Firebase project
- **Public directory**: `web-build`
- **Configure as single-page app**: `Yes`
- **Overwrite index.html**: `No`

### 3.4 Build and Deploy

```bash
# Build the web version
npx expo export:web

# Deploy to Firebase
firebase deploy --only hosting
```

## 🌐 Step 4: Set Up Automatic Deployment (Optional)

### 4.1 Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate new private key**
5. Download the JSON file

### 4.2 Add Secret to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. **Name**: `FIREBASE_SERVICE_ACCOUNT`
5. **Value**: Paste the entire content of the JSON file you downloaded
6. Click **Add secret**

### 4.3 Update GitHub Actions Workflow

Edit `.github/workflows/deploy.yml` and update the `projectId` to match your Firebase project ID.

## 📱 Step 5: Test Your Deployment

1. **Visit your Firebase hosting URL** (shown after deployment)
2. **Test the app functionality**:
   - Sign up with a new account
   - Create some tasks and appointments
   - Test the authentication flow

## 🔧 Step 6: Update Firebase Configuration

Make sure your Firebase configuration in `src/services/firebase.ts` is correct:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 🚀 Step 7: Continuous Deployment

Now every time you push to the `main` branch, your app will automatically:
1. Build the web version
2. Deploy to Firebase Hosting
3. Be available at your Firebase hosting URL

## 📋 What You'll Get

✅ **GitHub Repository**: Version control and collaboration
✅ **Firebase Hosting**: Live web version of your app
✅ **Automatic Deployment**: Updates on every push
✅ **Professional Setup**: Ready for production use

## 🔗 Your URLs

- **GitHub Repository**: `https://github.com/YOUR_USERNAME/matts-eldercare-app`
- **Firebase Hosting**: `https://your-project-id.web.app`
- **Firebase Console**: `https://console.firebase.google.com/project/your-project-id`

## 🎉 Next Steps

1. **Share the repository** with your team
2. **Set up branch protection** rules
3. **Add more features** and push to GitHub
4. **Monitor your Firebase usage** and costs
5. **Set up custom domain** if needed

## 🆘 Troubleshooting

### Build Issues
```bash
# Clear cache and rebuild
npx expo export:web --clear
```

### Deployment Issues
```bash
# Check Firebase status
firebase projects:list

# Re-login if needed
firebase logout
firebase login
```

### GitHub Actions Issues
- Check the **Actions** tab in your GitHub repository
- Verify your Firebase service account secret is correct
- Ensure your project ID matches in the workflow file

## 📞 Support

If you encounter any issues:
1. Check the Firebase documentation
2. Review GitHub Actions logs
3. Verify your configuration files
4. Test locally before pushing

Your app is now professionally set up with GitHub and Firebase Hosting! 🎉
