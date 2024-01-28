import winston from 'winston';
import fs from 'fs';

const logsDir = 'logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.simple()
);

const levels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5
};

const colors = {
  fatal: 'red',
  error: 'red',
  warning: 'yellow',
  info: 'green',
  http: 'green',
  debug: 'blue'
};

winston.addColors(colors);

const logger = winston.createLogger({
  levels,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/app-dev.log' })
  ]
});

export default logger;
