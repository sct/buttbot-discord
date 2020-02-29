import Discord, { TextChannel, MessageReaction } from 'discord.js';

import logger from '../core/logger';
import {
  commandAbout,
  commandFirstRule,
  commandUnknown,
  commandHelp,
  commandButtifyCount,
} from './commands/generalCommands';
import buttify, { shouldWeButt } from '../core/butt';
import {
  commandServerWhitelist,
  commandServerAccess,
  commandServerSetting,
} from './commands/serverCommands';
import servers from '../core/handlers/Servers';
import wordsDb from '../core/handlers/Words';

const BOT_SYMBOL = '?';

type CommandReturnTypes = ReturnType<
  | typeof commandAbout
  | typeof commandHelp
  | typeof commandFirstRule
  | typeof commandButtifyCount
  | typeof commandServerWhitelist
  | typeof commandServerAccess
  | typeof commandServerSetting
  | typeof commandUnknown
>;

class BotController {
  public client = new Discord.Client();

  public connect = (): void => {
    this.client.login(process.env.DISCORD_BOT_TOKEN);

    this.client.on('ready', () => {
      logger.info('Welcome to ButtBot (Discord Edition)');
      logger.info(
        "Remember! Isaac Buttimov's First Rule of Buttbotics: Don't let buttbot reply to buttbot."
      );
      logger.info('Connected to Discord');

      this.client.user.setPresence({
        game: { name: 'buttbot.net | ?butt about' },
      });
    });

    this.client.on('error', error => {
      logger.error(`Something went wrong. Reason: ${error.message}`);
    });
  };

  public prepare = (): void => {
    this.loadListeners();
  };

  private loadListeners = (): void => {
    this.client.on('message', message => {
      if (message.content.match(/^\?butt(.*)/)) {
        this.handleCommand(message);
      } else {
        this.handleButtChance(message);
      }
    });
  };

  public handleCommand = async (message: Discord.Message): Promise<void> => {
    const command = message.content
      .replace(`${BOT_SYMBOL}butt `, '')
      .split(' ');

    logger.info(command);

    try {
      switch (command[0]) {
        case 'about':
          await commandAbout(message);
          break;
        case 'help':
          await commandHelp(message);
          break;
        case 'firstrule':
          await commandFirstRule(message);
          break;
        case 'stats':
          await commandButtifyCount(message);
          break;
        case 'whitelist':
          await commandServerWhitelist(message);
          break;
        case 'access':
          await commandServerAccess(message);
          break;
        case 'setting':
          await commandServerSetting(message, command[1], command[2]);
          break;
        default:
          await commandUnknown(message);
      }
    } catch (error) {
      logger.info(`Command error occured: ${error.message}`, {
        command,
        error,
      });
    }
  };

  public async handleButtChance(message: Discord.Message): Promise<void> {
    logger.debug('Handling butt chance');
    try {
      const server = await servers.getServer(message.guild.id);

      const whitelist = await server.getWhitelist();
      const config = await server.getSettings();
      logger.debug('Server config', { config });

      // This is a small in-memory lock to prevent the bot from spamming back to back messages
      // on a single server due to strange luck.
      // Because the chance is calculated AFTER the lock is reset, there is only a roll for a
      // buttification chance every X number of messages
      if (server.lock > 0) {
        server.lock -= 1;
      }

      const messageChannel = message.channel as TextChannel;

      // Do the thing to handle the butt chance here
      if (
        (this.client.user.id !== message.author.id ||
          !message.author.bot ||
          config.breakTheFirstRuleOfButtbotics) &&
        whitelist.includes(messageChannel.name) &&
        server.lock === 0 &&
        Math.random() < config.chanceToButt
      ) {
        const availableWords = message.content.trim().split(' ');
        const wordsButtifiable = availableWords.filter(w => shouldWeButt(w));
        const wordsWithScores = await wordsDb.getWords(wordsButtifiable);
        const { result, words } = await buttify(
          message.content,
          wordsWithScores
        );
        const buttMessage = (await message.channel.send(
          result
        )) as Discord.Message;
        logger.debug('Send buttified message to channel', { result });

        // Our dumb buttAI code
        if (config.buttAI === 1) {
          logger.debug('ButtAI is enabled. Adding and collecting reactions...');
          const emojiFilter = (reaction: MessageReaction): boolean =>
            reaction.emoji.name === '👍' || reaction.emoji.name === '👎';
          const collector = buttMessage.createReactionCollector(emojiFilter, {
            time: 1000 * 60 * 10,
          });
          await buttMessage.react('👍');
          await buttMessage.react('👎');
          logger.debug('Bot reactions added');
          collector.on('end', async collected => {
            try {
              const upbutts = (collected.get('👍')?.count ?? 0) - 1;
              const downbutts = (collected.get('👎')?.count ?? 0) - 1;
              const score = upbutts - downbutts;
              logger.debug('Collecting reactions and getting score', { score });

              if (score) {
                words.forEach(async word => {
                  wordsDb.updateScore(word, score);
                });
                // When the time runs out, we will clear reactions and
                // react with the winning vote and a lock
                await buttMessage.react('🔒');
                if (upbutts >= downbutts) {
                  await buttMessage.react('🎉');
                } else {
                  await buttMessage.react('😭');
                }
                logger.debug('Recorded score for words', { score, words });
              } else {
                logger.debug('Score 0. No changes recorded for words', {
                  words,
                });
              }
            } catch (error) {
              logger.error('Something went wrong collecting reaction', error);
            }
          });
        }

        server.lock = config.buttBuffer;
        server.trackButtification();
      }
    } catch (error) {
      logger.debug('Something went wrong handling butt chance', error);
    }
  }
}

export default BotController;
