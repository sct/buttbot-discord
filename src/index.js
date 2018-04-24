import dotenv from 'dotenv';

import BotController from './bot/BotController';
import db from './core/db';

dotenv.config();

// Configure Database
db.servers.loadDatabase();

// Initialize Bot
const bot = new BotController();

bot.connect();
bot.prepare();
