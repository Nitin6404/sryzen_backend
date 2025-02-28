import winston from 'winston';
import path from 'path';

const logDir = 'logs';

// Custom format for better readability
const customFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  // Remove service from metadata for cleaner output
  const { service, ...rest } = metadata;
  
  // Format metadata if it exists
  let metaStr = '';
  if (Object.keys(rest).length > 0) {
    // Format specific fields for better readability
    if (rest.method && rest.url) {
      metaStr = `[${rest.method}] ${rest.url}`;
      if (rest.status) {
        metaStr += ` - ${rest.status}`;
      }
      if (rest.duration) {
        metaStr += ` (${rest.duration})`;
      }
    } else {
      metaStr = JSON.stringify(rest);
    }
  }

  // Return formatted log string
  return `${timestamp} [${level.toUpperCase()}] ${message} ${metaStr}`.trim();
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    customFormat
  ),
  transports: [
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ]
});

// Add console transport in non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      customFormat
    )
  }));
}

export default logger;