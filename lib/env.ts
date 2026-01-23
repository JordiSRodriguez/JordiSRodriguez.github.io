/**
 * Environment variable validation and type-safe access
 * Provides runtime validation and TypeScript safety for environment variables
 */

/**
 * Validates that a required environment variable is set
 * Throws an error if the variable is missing or empty
 */
function validateEnvVar(
  name: string,
  value: string | undefined
): string {
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${name}. Please check your .env.local file.`
    );
  }
  return value;
}

/**
 * Type-safe environment variables with runtime validation
 */
const env = {
  // Supabase
  supabaseUrl: validateEnvVar(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  ),
  supabaseAnonKey: validateEnvVar(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ),

  // OpenWeather API
  openWeatherApiKey: validateEnvVar(
    "NEXT_PUBLIC_OPENWEATHER_API_KEY",
    process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
  ),

  // Deployment environment
  nodeEnv: process.env.NODE_ENV || "development",
} as const;

/**
 * Type helper for environment variable names
 */
type EnvKey = keyof typeof env;

/**
 * Safely get an environment variable with TypeScript typing
 */
export function getEnv<K extends EnvKey>(key: K): typeof env[K] {
  return env[key];
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return env.nodeEnv === "development";
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return env.nodeEnv === "production";
}

/**
 * Check if we're in test mode
 */
export function isTest(): boolean {
  return env.nodeEnv === "test";
}

export default env;
