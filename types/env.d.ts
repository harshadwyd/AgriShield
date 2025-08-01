declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
      EXPO_PUBLIC_WEATHER_API_KEY?: string;
      EXPO_PUBLIC_AI_SERVICE_URL?: string;
    }
  }
}

// Ensure this file is treated as a module
export {};