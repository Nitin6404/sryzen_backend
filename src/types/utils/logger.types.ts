export interface LogMetadata {
  service?: string;
  method?: string;
  url?: string;
  status?: number;
  duration?: string;
  error?: {
    message: string;
    stack?: string;
  };
  [key: string]: any;
}

export interface Logger {
  debug(message: string, meta?: LogMetadata): void;
  info(message: string, meta?: LogMetadata): void;
  warn(message: string, meta?: LogMetadata): void;
  error(message: string, meta?: LogMetadata): void;
}
