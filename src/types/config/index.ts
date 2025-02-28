export interface DatabaseConfig {
  url: string;
  dialect: 'postgres';
  dialectOptions: {
    ssl: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
}

export interface SwaggerConfig {
  title: string;
  description: string;
  version: string;
  basePath: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  logLevel: string;
  rateLimitWindowMs: number;
  rateLimitMax: number;
}