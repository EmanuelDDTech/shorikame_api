import pino from 'pino-http';

const isDev = process.env.NODE_ENV !== 'production';

const logger = pino({
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

export default logger;
