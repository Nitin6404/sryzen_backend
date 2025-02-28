export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  PGHOST: string;
  PGDATABASE: string;
  PGUSER: string;
  PGPASSWORD: string;
  API_VERSION: string;
  CORS_ORIGIN: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX: number;
}