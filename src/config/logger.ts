import { createLogger, transports, format } from "winston";
import path from "path";

// Define log file location and name
const logFile = path.join(__dirname, "logs", "app.log");

// Create a custom log format
const logFormat = format.printf(({ timestamp, level, message, service }) => {
  return `${timestamp} [${service}] ${level}: ${message}`;
});

// Create custom logger instance
export const logger = createLogger({
  level: "info",
  defaultMeta: { service: "uploadje" },
  transports: [
    // Console transport
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        logFormat
      ),
    }),

    // File transport for log rotation
    new transports.File({
      filename: logFile,
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5, // Maximum number of log files to keep
      tailable: true, // Enable log rotation
      format: format.combine(
        format.timestamp(),
        logFormat
      ),
    }),
  ],
});
