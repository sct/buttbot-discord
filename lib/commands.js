var config = require('../config');
var authority = require('./authority');
var stats = require('./stats');
var _ = require('underscore');

Commands = [];

Commands["info"] = {
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
    authLevel: 0,
    fn: function(bot, params, message) {
        var ac = _.keys(Commands);

        var acString = ac.join(", ");

        bot.reply(message, [
            "Buttbot help is available 24/7 for all your buttifying needs!",
            "**Available Commands:**",
            acString
        ])
    }
}

Commands['myinfo'] = {
    authLevel: 0,
    fn: function(bot, params, message) {
        bot.reply(message, [
            "your user id is **" + message.author.id + "**"
        ])
    }
}

Commands["firstrule"] = {
    authLevel: 0,
    fn: function(bot, params, message) {
        bot.reply(message, "remember! Isaac Buttimov's First Rule of Buttbotics: Don't let buttbot reply to buttbot.");
    }
}

Commands['access'] = {
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

Commands['reset'] = {
    authLevel: 2,
    fn: function(bot, params, message) {
        stats.reset(message.channel.server);
        bot.reply(message, "I have reset the stats for this server.");
    }
}

Commands["join"] = {
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

exports.Commands = Commands;
