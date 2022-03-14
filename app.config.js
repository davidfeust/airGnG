import 'dotenv/config';

export default {
    expo: {
        plugins: [
            [
                'expo-image-picker',
                {
                    photosPermission:
                        'The app accesses your photos to let you share them with your friends.',
                },
            ],
        ],
        name: 'airGnG',
        slug: 'airGnG',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',

        splash: {
            image: './assets/splash.png',
            resizeMode: 'contain',
            backgroundColor: '#ffffff',
        },
        updates: {
            fallbackToCacheTimeout: 0,
        },
        assetBundlePatterns: ['**/*'],
        ios: {
            supportsTablet: true,
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/adaptive-icon.png',
                backgroundColor: '#FFFFFF',
            },
            userInterfaceStyle: 'automatic',
        },
        web: {
            favicon: './assets/favicon.png',
        },
        extra: {
            apiKey: process.env.API_KEY,
            authDomain: process.env.AUTH_DOMAIN,
            projectId: process.env.PROJECT_ID,
            storageBucket: process.env.STORAGE_BUCKET,
            messagingSenderId: process.env.MESSAGING_SENDER_ID,
            appId: process.env.APP_ID,
            googleMapsApi: process.env.GOOGLE_MAPS_APIKEY,
        },
    },
};
