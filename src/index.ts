import dotenv from 'dotenv';
import Fastify from 'fastify';
import cors from 'fastify-cors';
import BotController from './bot/BotController';
import db from './core/db';
import { version } from '../package.json';
import config from './config';
import stats from './core/handlers/Stats';

dotenv.config();

// Configure Database
db.servers.loadDatabase();
db.words.loadDatabase();

// Set up interval writes
const compactionInterval = 1000 * 60 * 60;
db.servers.persistence.setAutocompactionInterval(compactionInterval);
db.words.persistence.setAutocompactionInterval(compactionInterval);

// Initialize Bot
const bot = new BotController();

bot.connect();
bot.prepare();

// Mini API Butt Server

const fastify = Fastify({
  logger: true,
});

fastify.register(cors);

fastify.get('/', async (): Promise<{
  name: string;
  version: string;
  buttifyCount: number;
  totalServers: number;
}> => {
  const buttifyCount = await stats.getButtifyCount();
  const totalServers = bot.client.guilds.cache.size;
  return {
    name: 'Buttbot Mini Stats API',
    version,
    buttifyCount,
    totalServers,
  };
});

const start = async (): Promise<void> => {
  try {
    await fastify.listen(config.apiPort);
    fastify.log.info(`server listening on ${config.apiPort}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
