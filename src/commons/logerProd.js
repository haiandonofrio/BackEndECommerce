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
  info: 3
};

const colors = {
  fatal: 'red',
  error: 'red',
  warning: 'yellow',
  info: 'green'
};

winston.addColors(colors);

const logger = winston.createLogger({
  levels,
  format: logFormat,
  transports: [
    new winston.transports.File({ filename: 'logs/app-prod.log' })
  ]
});

export default logger;
