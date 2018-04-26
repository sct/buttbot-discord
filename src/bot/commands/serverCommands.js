import Servers from '../../core/handlers/Servers';
import logger from '../../core/logger';

async function verifyPermission(message) {
  const server = await Servers.getServer(message.guild.id);
  const roles = await server.getRoles();

  const { member } = message;

  if (member.id !== message.guild.ownerID
    && !roles.find(roleId => member.roles.get(roleId))
    && !member.hasPermissions('MANAGE_GUILD')) {
    message.channel.send('You do not have permission to manage buttification');
    logger.debug('Unauthorized user attempting command access');
    return false;
  }

  return true;
}

export async function commandServerWhitelist(message) {
  const server = await Servers.getServer(message.guild.id);

  const whitelist = await server.getWhitelist();

  if (!await verifyPermission(message)) {
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
}

export async function commandServerAccess(message) {
  const server = await Servers.getServer(message.guild.id);
  const roles = await server.getRoles();

  if (!await verifyPermission(message)) {
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
}

export default commandServerWhitelist;
