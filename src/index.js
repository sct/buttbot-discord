import dotenv from 'dotenv';

import BotController from './bot/BotController';
import db from './core/db';

dotenv.config();

// Configure Database
db.servers.loadDatabase();

// Set up interval writes
const compactionInterval = 1000 * 60 * 60;
db.servers.persistence.setAutocompactionInterval(compactionInterval);

// Initialize Bot
const bot = new BotController();

bot.connect();
bot.prepare();
