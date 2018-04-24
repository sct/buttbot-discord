import Servers from '../../core/handlers/Servers';

export async function commandServerWhitelist(message) {
  const server = await Servers.getServer(message.guild.id);

  const whitelist = await server.getWhitelist();

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

export default commandServerWhitelist;
