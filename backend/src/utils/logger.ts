/* eslint-disable @typescript-eslint/no-shadow */
import colors from 'colors';
import { format } from 'date-fns';
import type { FastifyBaseLogger } from 'fastify';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import argv from './argv.js';
import { logPath } from './pathUtils.js';

const { combine, timestamp, label, printf, splat } = winston.format;

type TLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';
type THTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/** 格式化日期 */
const formatDate = (dateStr: string) => format(new Date(dateStr), 'MM-dd HH:mm:ss');

/** 获取各 log level 的颜色 */
const getLevelColor = (level: TLevel) => {
  switch (level) {
    case 'error':
      return 'bgRed';
    case 'debug':
      return 'bgGray';
    case 'http':
      return 'bgBlue';
    case 'info':
      return 'bgGreen';
    case 'silly':
      return 'bgGray';
    case 'verbose':
      return 'bgGray';
    case 'warn':
      return 'bgYellow';
    default:
      return 'bgGray';
  }
};

/** 获取各 HTTP 请求方法的颜色 */
const getMethodColor: (method: THTTPMethod) => keyof colors.Color = (method) => {
  switch (method) {
    case 'GET':
      return 'bgGreen';
    case 'POST':
      return 'bgBlue';
    case 'PUT':
      return 'bgYellow';
    case 'DELETE':
      return 'bgRed';
    default:
      return 'bgMagenta';
  }
};

const myConsoleFormat = printf(({ level, message, label, timestamp, statusCode, method }) => {
  const levelStr = getLevelColor(level as TLevel);
  let statusColor = 'bgRed';
  if ((statusCode?.toString() as string | undefined)?.startsWith('1')) {
    statusColor = 'bgBlue';
  }
  if ((statusCode?.toString() as string | undefined)?.startsWith('2')) {
    statusColor = 'bgGreen';
  }
  if ((statusCode?.toString() as string | undefined)?.startsWith('3')) {
    statusColor = 'bgGrey';
  }
  let strToReturn = label + colors.underline(formatDate(timestamp));
  if (level !== 'http') {
    // colors.js is not fully typed, so sad.
    /* @ts-ignore */
    strToReturn += ` ${colors[levelStr](`[${level.toUpperCase()}]`)}`;
  } else {
    /* @ts-ignore */
    strToReturn += ` ${colors[getMethodColor(method as THTTPMethod)](`[${method}]`)} ${colors[
      statusColor
    ](`${statusCode}`)}`;
  }
  return `${strToReturn} ${colors.dim(message)}`;
});

const myFileFormat = printf(
  ({ level, message, timestamp, statusCode, method }) =>
    `${formatDate(timestamp)} [${level}] ${method ? `[${method}] ` : ''}${
      statusCode ? `[${statusCode}] ` : ''
    }${message}`,
);

const fileFormat = combine(splat(), timestamp(), myFileFormat);
const consoleFormat = combine(label({ label: '⚛ ' }), timestamp(), myConsoleFormat);

/** `drf` means `daily rotate file` */
const drfAllTransport = new DailyRotateFile({
  format: fileFormat,
  dirname: logPath,
  filename: 'log-%DATE%',
  extension: '.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '50m',
  maxFiles: '14d',
  level: 'silly',
});

const drfErrorTransport = new DailyRotateFile({
  format: fileFormat,
  dirname: logPath,
  filename: 'error-%DATE%',
  extension: '.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '50m',
  maxFiles: '365d',
  level: 'error',
});

const consoleTransport = new winston.transports.Console({
  format: consoleFormat,
  level: !argv.dev ? 'verbose' : 'silly',
});

const logger = winston.createLogger({
  transports: [drfAllTransport, drfErrorTransport, consoleTransport],
});

(logger as unknown as FastifyBaseLogger).fatal = logger.error;
(logger as unknown as FastifyBaseLogger).trace = logger.error;

export default logger;
