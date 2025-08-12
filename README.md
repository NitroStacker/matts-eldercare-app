# Matt's Eldercare App

A comprehensive eldercare management application built with React Native and Expo, featuring task management, appointment scheduling, and user authentication.

## 🚀 Features

- **User Authentication**: Secure signup/login with email and password
- **Task Management**: Create, edit, delete, and track tasks with priorities and categories
- **Appointment Scheduling**: Manage appointments with providers and locations
- **User Profiles**: Personal information and emergency contact management
- **Real-time Data**: All data is synchronized with Firebase backend
- **Cross-platform**: Works on iOS and Android devices

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Firebase (Authentication, Firestore Database)
- **State Management**: React Context API
- **UI Design**: Apple Human Interface Guidelines
- **Authentication**: Firebase Auth with JWT tokens

## 📱 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/matts-eldercare-app.git
   cd matts-eldercare-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Update the Firebase configuration in `src/services/firebase.ts`

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device**
   - Install Expo Go on your mobile device
   - Scan the QR code from the terminal

## 🔧 Configuration

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication → Sign-in method → Email/Password
4. Enable Firestore Database → Start in test mode
5. Get your Firebase config and update `src/services/firebase.ts`

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React Context for state management
├── screens/            # App screens
├── services/           # API and Firebase services
├── theme/              # Design system and styling
└── types/              # TypeScript type definitions
```

## 🚀 Deployment

### Firebase Hosting (Web)

1. **Build for web**
   ```bash
   npx expo export:web
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

### App Store Deployment

1. **Build for production**
   ```bash
   eas build --platform ios
   eas build --platform android
   ```

2. **Submit to stores**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Matt's Eldercare App - Built for better eldercare management

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- Firebase for backend services
- React Native community for excellent documentation and support
