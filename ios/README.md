# ArcusHR iOS App

A native iOS application for the ArcusHR Human Resource Management Platform, built with React Native and Expo.

## Features

- **Employee Portal**: Complete mobile access to HR features
- **Attendance Tracking**: Real-time check-in/out with location services
- **Leave Management**: Request and track time off on mobile
- **Profile Management**: Update personal information
- **Push Notifications**: Real-time updates for important events
- **Offline Support**: Core features work without internet connection

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **React Native Paper**: Material Design components
- **React Navigation**: Navigation library
- **AsyncStorage**: Local data persistence
- **Expo Notifications**: Push notification support

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator (for development)
- Apple Developer Account (for App Store deployment)

### Installation

1. Navigate to the iOS directory:
   ```bash
   cd ios
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on iOS simulator:
   ```bash
   npm run ios
   ```

### Configuration

1. Update the API URL in `src/services/ApiClient.ts`:
   ```typescript
   this.baseUrl = 'https://your-api-domain.com/api';
   ```

2. Configure your Expo project ID in `app.json`:
   ```json
   {
     "expo": {
       "extra": {
         "eas": {
           "projectId": "your-project-id"
         }
       }
     }
   }
   ```

## Building for Production

### iOS App Store

1. Configure EAS Build:
   ```bash
   eas build:configure
   ```

2. Build for iOS:
   ```bash
   npm run build:ios
   ```

3. Submit to App Store:
   ```bash
   npm run submit:ios
   ```

## Project Structure

```
ios/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (Auth, Language, etc.)
│   ├── navigation/         # Navigation configuration
│   ├── screens/            # App screens
│   │   ├── admin/          # Admin-specific screens
│   │   ├── auth/           # Authentication screens
│   │   └── employee/       # Employee-specific screens
│   ├── services/           # API client and other services
│   ├── theme/              # Theme configuration
│   └── utils/              # Utility functions
├── assets/                 # Images, fonts, etc.
├── App.tsx                 # Main app component
├── app.json                # Expo configuration
└── babel.config.js         # Babel configuration
```

## Default Login Credentials

The application connects to the same backend as the web version and uses the same credentials:

- **Admin**: admin@demo.com / admin123
- **Employee**: employee@demo.com / employee123

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on iOS devices
5. Submit a pull request

## License

This project is licensed under the MIT License.