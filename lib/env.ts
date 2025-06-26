// Simple getEnv function for accessing environment variables in a unified way
// Usage: getEnv().apiUrl, getEnv().baseUrl, getEnv().authUrl, getEnv().authSecret

export function getEnv() {
  const env = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    authUrl: process.env.NEXTAUTH_URL,
    authSecret: process.env.NEXTAUTH_SECRET,
  };

  Object.entries(env).forEach(([key, value]) => {
    if (!value) {
      // Only log in development mode on client, always log on server
      if (
          (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') ||
          typeof window === 'undefined'
      ) {
        console.warn(`Environment variable for ${key} is missing or empty.`);
      }
    }
  });

  return env;
}
