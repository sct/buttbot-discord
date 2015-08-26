var config = require('../config');
var authority = require('./authority');
var stats = require('./stats');
var options = require('./options');
var _ = require('underscore');

Commands = [];

Commands["info"] = {
    usage: "info",
    description: "Basic information about Buttbot",
    authLevel: 0,
    fn: function(bot, params, message) {
        bot.reply(message, [
            "Hi! I am **ButtBot**!",
            "I have buttified " + stats.getStat(message.channel.server, "buttifyCount") + " messages in **" + message.channel.server.name + "**",
            "Across all servers, I have buttified " + stats.getGlobalStat("buttifyCount") + " messages",
            "I am connected to " + bot.servers.length + " servers and I can be in yours! Type **" + config.bot.commandPrefix + "join <invite id>** to have your own Buttbot!",
            "Need help? Type **" + config.bot.commandPrefix + "help**"
        ]);
    }
}

Commands["help"] = {
    usage: "help <command>",
    description: "Detailed help on each command available to users",
    authLevel: 0,
    fn: function(bot, params, message) {
        if (params[0]) {
            if (Commands[params[0]]) {
                var cmd = params[0];
                bot.sendMessage(message.channel, [
                    "**Command:** " + cmd,
                    "**Usage:** " + config.bot.commandPrefix + Commands[cmd].usage,
                    "**Auth Level:** " + Commands[cmd].authLevel,
                    "**Description:** " + Commands[cmd].description
                ]);
            } else {
                bot.reply(message, "I do not know what command you are referring to.");
            }
        } else {
            var ac = _.keys(Commands);

            var acString = ac.join(", ");

            bot.reply(message, [
                "Buttbot help is available 24/7 for all your buttifying needs!",
                "**Available Commands:**",
                acString,
                "Type **" + config.bot.commandPrefix + "help <command>** for detailed information"
            ]);
        }
    }
}

Commands['myinfo'] = {
    usage: "myinfo",
    description: "Returns your discord user ID",
    authLevel: 0,
    fn: function(bot, params, message) {
        bot.reply(message, [
            "your user id is **" + message.author.id + "**"
        ])
    }
}

Commands["firstrule"] = {
    usage: "firstrule",
    description: "Just the first rule...",
    authLevel: 0,
    fn: function(bot, params, message) {
        bot.reply(message, "remember! Isaac Buttimov's First Rule of Buttbotics: Don't let buttbot reply to buttbot.");
    }
}

Commands['access'] = {
    usage: "access <user>",
    description: "Use to determine access level with bot. Takes optional argument to look up access level of a particular user",
    authLevel: 0,
    fn: function(bot, params, message) {
        var user = message.author;
        var target = false;
        if (params[0]) {
            user = getUser(message, params);
            target = true;

            if (!user) {
                return bot.reply(message, "I am unable to find the user you specified.");
            }
        }
        authority.getUserLevel(message.channel.server, user, function(err, level) {
            if (target) {
                bot.reply(message, user.username + "'s access level in this server is **" + level + "**");
            } else {
                bot.reply(message, "your access level in this server is **" + level + "**");
            }

        });
    }
}

Commands['permit'] = {
    usage: "permit <user>",
    description: "Permits a user to use basic auth level actions such as mute and unmute",
    authLevel: 2,
    fn: function(bot, params, message) {
        if (params[0]) {
            user = getUser(message, params);

            if (!user) {
                return bot.reply(message, "I am unable to find the user you specified.");
            }

            authority.setUserLevel(message.channel.server, user, 1, function(err) {
                if (err) {
                    console.log(err);
                }
                return bot.reply(message, "I have given " + user + " access in **" + message.channel.server.name + "**");
            });
        } else {
            return bot.reply(message, "you must give me a user!");
        }
    }
}

Commands['revoke'] = {
    usage: "revoke <user>",
    description: "Revokes basic auth access from a user",
    authLevel: 2,
    fn: function(bot, params, message) {
        if (params[0]) {
            user = getUser(message, params);

            if (!user) {
                return bot.reply(message, "I am unable to find the user you specified.");
            }

            authority.setUserLevel(message.channel.server, user, 0, function(err) {
                if (err) {
                    console.log(err);
                }
                return bot.reply(message, "I have revoked " + user + "'s access in **" + message.channel.server.name + "**");
            });
        } else {
            return bot.reply(message, "you must give me a user!");
        }
    }
}

Commands['muted'] = {
    usage: "muted",
    description: "Get muted status for the bot",
    authLevel: 1,
    fn: function(bot, params, message) {
        var server = message.channel.server;
        var mutedChannels = JSON.parse(options.getOption(server, "mutedChannels"));
        var mutedNames = [];

        _.each(mutedChannels, function(cid) {
            var channel = getChannel(message, cid);

            if (channel) {
                mutedNames.push("#" + channel.name);
            }
        });

        mutedChannels = mutedNames.join(", ");

        console.log(mutedChannels);

        bot.reply(message, [
            "here are the current operating levels of my buttification OS",
            options.getOption(server, "muted") ? "I am currently **muted** in every channel" : "I am not globally muted",
            "**Muted Channels**: " + (!mutedNames ? "No channel specific mutes" : mutedChannels)
        ])
    }
}

Commands['mute'] = {
    usage: "mute <channel>",
    description: "Mutes the bot globally on a server or takes an optional argument to mute a specific channel.",
    authLevel: 1,
    fn: function(bot, params, message) {
        if (params[0]) {
            var mutedChannels = JSON.parse(options.getOption(message.channel.server, "mutedChannels"));

            if (!mutedChannels) {
                mutedChannels = [];
            }

            var channel = message.channel.server.getChannel("name", params[0]);

            if (channel) {
                if (_.contains(mutedChannels, channel.id)) {
                    bot.reply(message, "I have already muted #" + channel.name);
                } else {
                    mutedChannels.push(channel.id);
                    options.setOption(message.channel.server, "mutedChannels", JSON.stringify(mutedChannels));
                    bot.reply(message, "I have muted #" + channel.name);
                }
            } else {
                bot.reply(message, "I do not know what channel that is.");
            }
        } else {

            if (options.getOption(message.channel.server, "muted")) {
                bot.reply(message, "buttification system is already deactivated.");
            } else {
                options.setOption(message.channel.server, "muted", true);
                bot.reply(message, "buttification system deactivated.");
            }
        }
    }
}

Commands['unmute'] = {
    usage: "unmute <channel>",
    description: "Unmutes the bot globally on a server or takes an optional argument to unmute a specific channel.",
    authLevel: 1,
    fn: function(bot, params, message) {
        if (params[0]) {
            var mutedChannels = JSON.parse(options.getOption(message.channel.server, "mutedChannels"));

            if (!mutedChannels) {
                mutedChannels = [];
            }

            var channel = message.channel.server.getChannel("name", params[0]);

            if (channel) {
                if (_.contains(mutedChannels, channel.id)) {
                    mutedChannels = _.without(mutedChannels, channel.id);
                    options.setOption(message.channel.server, "mutedChannels", JSON.stringify(mutedChannels));
                    bot.reply(message, "I have unmuted #" + channel.name);
                } else {
                    bot.reply(message, "#" + channel.name + " is not muted");
                }
            } else {
                bot.reply(message, "I do not know what channel that is.");
            }
        } else {
            if (options.getOption(message.channel.server, "muted")) {
                options.setOption(message.channel.server, "muted", false);
                bot.reply(message, "buttification system reactivated.");
            } else {
                bot.reply(message, "buttification system is already active.");
            }
        }
    }
}

Commands['reset'] = {
    usage: "reset",
    description: "Resets all statstics for the bot on the server.",
    authLevel: 2,
    fn: function(bot, params, message) {
        stats.reset(message.channel.server);
        bot.reply(message, "I have reset the stats for this server.");
    }
}

Commands["join"] = {
    usage: "join <invite id>",
    description: "Joins a discord server. Cannot join URLs. Make sure to just include the invite ID.",
    authLevel: 0,
    fn: function(bot, params, message) {
        bot.joinServer(params[0], function(err, server) {
            bot.reply(message, "I have joined the server **" + server.name + "**");
            authority.setUserLevel(server, server.owner, 2, function(err) {
                if (err) {
                    console.log("Unable to set user auth level", err);
                }
            });
            bot.sendMessage(server.defaultChannel, [
                "Hello! I am **ButtBot**",
                "I was asked to join this channel by " + message.author,
                "I have determined the channel owner is " + server.owner + " and have given this user administrative action over me in this server",
                "If you do not wish for me to be in this server, you can ask me to leave by typing **" + config.bot.commandPrefix + "leave**"
            ]);
        });
    }
}

Commands["leave"] = {
    usage: "leave",
    description: "Leaves the discord server",
    authLevel: 2,
    fn: function(bot, params, message) {
        bot.leaveServer(message.channel.server, function(err) {
            bot.sendMessage(message.author, [
                "I have left the server **" + message.channel.server.name + "**",
                "If you would like me to rejoin, type **" + config.bot.commandPrefix + "join <invite code>**"
            ]);
        });
    }
}

function getUser(message, userParam) {
    return message.channel.server.getMember("username", userParam.join(" "));
}

function getChannel(message, cid) {
    return channel = message.channel.server.getChannel("id", cid);
}

exports.Commands = Commands;
