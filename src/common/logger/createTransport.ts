import { utilities } from 'nest-winston';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export const consoleTransport = new winston.transports.Console({
  level: 'info',
  format: winston.format.combine(
    winston.format.simple(),
    winston.format.timestamp(),
    utilities.format.nestLike('winston'),
  ),
});

interface RotateTransportOptions {
  level: 'info' | 'warn' | 'error';
  filename: string;
  dirname?: string;
}

export function createRotateTransport({
  level,
  filename,
  dirname,
}: RotateTransportOptions) {
  return new DailyRotateFile({
    level,
    dirname: dirname || 'logs',
    filename: `${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '10m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
  });
}
