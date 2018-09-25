import fs from 'fs';

import logger from './logger';

const stopwords = fs
  .readFileSync('./src/lib/stopwords')
  .toString()
  .split(/\r\n?|\n/);
logger.debug('Loaded stopwords');

export default stopwords;
