import Discord from 'discord.js';

import logger from '../core/logger';
import { commandAbout, commandFirstRule } from './commands/generalCommands';
import buttify from '../core/butt';
import config from '../config';

const BOT_SYMBOL = '?';

class BotController {
  constructor() {
    this.client = new Discord.Client();
  }

  connect = () => {
    this.client.login(process.env.DISCORD_BOT_TOKEN);

    this.client.on('ready', () => {
      logger.info('Welcome to ButtBot (Discord Edition)');
      logger.info('Remember! Isaac Buttimov\'s First Rule of Buttbotics: Don\'t let buttbot reply to buttbot.');
      logger.info('Connected to Discord');
    });
  }

  prepare = () => {
    this.loadListeners();
  }

  loadListeners = () => {
    this.client.on('message', message => {
      if (message.content.match(/^\?butt\s(.*)/)) {
        this.handleCommand(message);
      } else {
        this.handleButtChance(message);
      }
    });
  }

  handleCommand = (message) => {
    const command = message.content.replace(`${BOT_SYMBOL}butt `, '').split(' ');

    logger.info(command);

    switch (command[0]) {
      case 'about':
        return commandAbout(message);
      case 'firstrule':
        return commandFirstRule(message);
      default:
        return null;
    }
  }

  handleButtChance = (message) => {
    // Do the thing to handle the butt chance here
    if (this.client.user.id !== message.author.id || config.breakTheFirstRuleOfButtbotics) {
      buttify(message.content)
        .then(buttified => message.channel.send(buttified))
        .catch(error => logger.error(error));
    }
  }
}

export default BotController;
