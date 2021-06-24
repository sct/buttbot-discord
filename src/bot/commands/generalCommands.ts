import { MessageEmbed, Message } from 'discord.js';

import { version } from '../../../package.json';
import stats from '../../core/handlers/Stats';
import servers from '../../core/handlers/Servers';

export const commandUnknown = (message: Message): void => {
  message.channel.send(
    "Sorry! I don't know what you want of me! Try **?butt help** or **?butt about**"
  );
};

export const commandAbout = async (message: Message): Promise<void> => {
  const buttifyCount = await stats.getButtifyCount();
  const server = await servers.getServer(message.guild.id);

  const serverButtifyCount = await server.getButtifyCount();

  const embed = new MessageEmbed()
    .setAuthor('ButtBot')
    .setDescription(
      `ButtBot Discord is a homage to my favorite IRC bot in existence, the buttbot. It serves one simple purpose, comedy.

ButtBot Discord currently pales in comparison to the original buttbots beautiful and intelligent architecture but still tends to create the same amount of laughs.

Whats the deal with these reactions on every message now? This is a experiemntal new ButtAI system. We are trying to teach the bot to be funnier. You can disable it with ?butt setting buttAI 0
`
    )
    .addField('Help Command', '?butt help')
    .addField(
      'Buttified Servers',
      message.client.guilds.cache.size.toString(),
      true
    )
    .addField('Global Buttified Messages', buttifyCount.toString(), true)
    .addField(
      "This Server's Buttifications",
      serverButtifyCount.toString(),
      true
    )
    .addField('Want ButtBot on your server?', 'https://buttbot.net')
    .addField('GitHub', 'https://github.com/sct/buttbot-discord')
    .setFooter(`Version: ${version}`)
    .setColor([212, 228, 32]);

  message.channel.send({ embeds: [embed] });
};

export const commandHelp = (message: Message): void => {
  const embed = new MessageEmbed()
    .setAuthor('ButtBot Help')
    .setDescription(
      'The following commands are available to roles with permissions or server owners:'
    )
    .addField(
      '?butt whitelist #channelname',
      'Add or remove a channel from the buttification whitelist. By default, no channels are added.'
    )
    .addField(
      '?butt access @rolename',
      'Add or remove a role from access control to ButtBot.'
    )
    .addField('?butt setting', 'Adjust bot settings for this server.')
    .setFooter('Never forget the firstrule')
    .setColor([212, 228, 32]);

  message.channel.send({ embeds: [embed] });
};

export const commandFirstRule = (message: Message): void => {
  message.reply(
    "remember! Isaac Buttimov's First Rule of Buttbotics: Don't let buttbot reply to buttbot."
  );
};

export const commandButtifyCount = async (message: Message): Promise<void> => {
  const buttifyCount = await stats.getButtifyCount();
  const server = await servers.getServer(message.guild.id);

  const serverButtifyCount = await server.getButtifyCount();

  message.channel.send(
    `I have buttified ${serverButtifyCount} message(s) on this server. Globally, I have already buttified ${buttifyCount} messages!`
  );
};

export default commandAbout;
