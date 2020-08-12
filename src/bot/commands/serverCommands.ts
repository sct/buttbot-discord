import Servers from '../../core/handlers/Servers';
import logger from '../../core/logger';
import { Message } from 'discord.js';

const verifyPermission = async (message: Message): Promise<boolean> => {
  const server = await Servers.getServer(message.guild.id);
  const roles = await server.getRoles();

  const { member } = message;

  if (
    member.id !== message.guild.ownerID &&
    !roles.find((roleId) => !!member.roles.cache.get(roleId)) &&
    !member.hasPermission('MANAGE_GUILD')
  ) {
    message.channel.send('You do not have permission to manage buttification');
    logger.debug('Unauthorized user attempting command access');
    return false;
  }

  return true;
};

export const commandServerWhitelist = async (
  message: Message
): Promise<Message | Message[]> => {
  const server = await Servers.getServer(message.guild.id);

  const whitelist = await server.getWhitelist();

  if (!(await verifyPermission(message))) {
    throw new Error('Permissions check failed');
  }

  if (!server) {
    throw new Error('Server doesnt exist. How are you even doing this?');
  }

  const { mentions } = message;

  const channel = mentions.channels.first();

  if (!channel) {
    return message.channel.send('You must provide a channel mention');
  }

  server.updateWhitelist(channel.name, whitelist.includes(channel.name));

  if (whitelist.includes(channel.name)) {
    return message.channel.send(`Removing #${channel.name} from whitelist`);
  }

  return message.channel.send(`Adding #${channel.name} to whitelist`);
};

export const commandServerAccess = async (
  message: Message
): Promise<Message | Message[]> => {
  const server = await Servers.getServer(message.guild.id);
  const roles = await server.getRoles();

  if (!(await verifyPermission(message))) {
    throw new Error('Permissions check failed');
  }

  if (!server) {
    throw new Error('Server doesnt exist. How are you even doing this?');
  }

  const { mentions } = message;

  const role = mentions.roles.first();

  if (!role) {
    return message.channel.send('You must provide a role mention');
  }

  server.updateRoles(role, roles.includes(role.id));

  if (roles.includes(role.id)) {
    return message.channel.send(`Removing ${role.name} from ButtBot access`);
  }

  return message.channel.send(`Adding ${role.name} to ButtBot access`);
};

export const commandServerSetting = async (
  message: Message,
  setting: string,
  value: string
): Promise<void> => {
  const server = await Servers.getServer(message.guild.id);

  if (!(await verifyPermission(message))) {
    throw new Error('Permissions check failed');
  }

  if (!server) {
    throw new Error('Server doesnt exist. How are you even doing this?');
  }

  const validSettings = ['chanceToButt', 'buttBuffer', 'buttAI'];

  if (!setting || !validSettings.includes(setting)) {
    message.channel.send(
      `Unknown setting. Valid settings are: ${validSettings.join(', ')}`
    );
    throw new Error('Unknown setting passed to bot');
  }

  if (!value) {
    message.channel.send('You must pass in a value');
  }

  switch (setting) {
    case 'chanceToButt':
      if (parseFloat(value) < 0 || parseFloat(value) > 1) {
        message.channel.send('You must pass in a value between 0 and 1');
        throw new Error('Invalid value passed in for chanceToButt');
      }

      message.channel.send(
        `The setting **${setting}** has been updated to: ${value}`
      );
      return server.setSetting(setting, parseFloat(value));
    case 'buttAI':
      if (Number(value) !== 0 && Number(value) !== 1) {
        message.channel.send(
          'You must pass in either 1 (enable) or 0 (disable)'
        );
        throw new Error('Invalid value passed in for buttAI');
      }

      message.channel.send(
        `The setting **${setting}** has been updated to: ${value}`
      );
      return server.setSetting(setting, Number(value));
    case 'buttBuffer':
      // Check if value is actually a number
      const parsedNumber = parseInt(value);
      if (isNaN(parsedNumber)) {
        message.channel.send('Please provide a valid number');
        throw new Error('Invalid value passed in for buttBuffer');
      }
      message.channel.send(
        `The setting **${setting}** has been updated to: ${value}`
      );
      return server.setSetting(setting, parsedNumber);
    default:
      message.channel.send(
        `The setting **${setting}** has been updated to: ${value}`
      );
      return server.setSetting(setting, value);
  }
};

export default commandServerWhitelist;
