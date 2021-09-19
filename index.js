const winston = require('winston');

const jsonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'json-service' },
  transports: [
      new winston.transports.Console(),
  ]
});

const fileLogger =  winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    defaultMeta: { service: 'file-service' },
    transports: [
        new winston.transports.File({ filename: '/tmp/app.log' }),
    ]
});

const plainLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(logEntry => `${logEntry.timestamp} ${logEntry.level} - ${logEntry.message}`)
    ),
    defaultMeta: { service: 'plain-service' },
    transports: [
        new winston.transports.Console({})
    ]
  });

const plainInterval = setInterval(() =>  {
    plainLogger.info('plain logger');
}, process.env.TEXT_LOG_INTERVAL || 10000);

const jsonInterval = setInterval(() =>  {
    jsonLogger.info('json logger');
}, process.env.JSON_LOG_INTERVAL || 10000);

const fileInterval = setInterval(() => {
    fileLogger.info('file logger');
}, process.env.FILE_LOG_INTERVAL || 10000);

process.on('SIGINT', () => {
    clearInterval(plainInterval);
    clearInterval(jsonInterval);
    clearInterval(fileInterval);
});