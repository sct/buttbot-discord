import * as winston from 'winston';
import * as dotenv from 'dotenv';

dotenv.config();

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  transports: [new winston.transports.Console()]
});

export default logger;
