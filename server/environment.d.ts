declare global {
    namespace NodeJS {
        interface ProcessEnv {
            GITHUB_AUTH_TOKEN: string;
            NODE_ENV: 'development' | 'production';
            PORT?: string;
            PWD: string;
            API_KEY: string;
            AUTH_DOMAIN: string;
            PROJECT_ID: string;
            STORAGE_BUCKET: string;
            MESSAGING_SENDER_ID: string;
            APP_ID: string;
            GOOGLE_MAPS_APIKEY: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
