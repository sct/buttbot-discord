import { RichEmbed } from 'discord.js';

import { version } from '../../../package.json';

export const commandUnknown = (message) => {
  message.channel.send('Sorry! I don\'t know what you want of me! Try **?butt help** or **?butt about**');
};

export const commandAbout = (message) => {
  const embed = new RichEmbed()
    .setAuthor('ButtBot')
    .setDescription(`ButtBot Discord is a homage to my favorite IRC bot in existence, the buttbot. It serves one simple purpose, comedy.

ButtBot Discord currently pales in comparison to the original buttbots beautiful and intelligent architecture but still tends to create the same amount of laughs.`)
    .addField('Help Command', '?butt help')
    .addField('GitHub', 'https://github.com/sct/buttbot-discord')
    .setFooter(`Version: ${version}`)
    .setColor([212, 228, 32]);

  message.channel.send(embed);
};

export const commandHelp = (message) => {
  const embed = new RichEmbed()
    .setAuthor('ButtBot Help')
    .setDescription('The following commands are available to roles with permissions or server owners:')
    .addField('?butt whitelist @channelname', 'Add or remove a channel from the buttification whitelist. By default, no channels are added.')
    .addField('?butt access @rolename', 'Add or remove a role from access control to ButtBot.')
    .setFooter('Never forget the firstrule')
    .setColor([212, 228, 32]);

  message.channel.send(embed);
}

export const commandFirstRule = (message) => {
  message.reply('remember! Isaac Buttimov\'s First Rule of Buttbotics: Don\'t let buttbot reply to buttbot.');
};

export default commandAbout;
