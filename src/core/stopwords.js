import fs from 'fs';

import logger from './logger';

const stopwords = fs.readFileSync('./lib/stopwords').toString().split(/\r\n?|\n/);
logger.debug('Loaded stopwords');

export default stopwords;
