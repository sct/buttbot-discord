var config = require('./config');
var _ = require('underscore');
var redis = require('redis');

var rclient = redis.createClient(config.redis.port, config.redis.host);

exports.getUserLevel = function(server, user, callback) {
    if (user.id == config.bot.masterUserId) {
        return callback(null, 10);
    }

    rclient.get("server:auth:" + server.id, function(err, res) {
        if (res) {
            var serverAuth = JSON.parse(res);

            if (serverAuth[user.id]) {
                return callback(null, serverAuth[user.id].level);
            }

            return callback(null, 0);
        } else {
            return callback(null, 0);
        }
    });
}

exports.setUserLevel = function(server, user, level, callback) {
    rclient.get("server:auth:" + server.id, function(err, res) {
        if (res) {
            var serverAuth = JSON.parse(res);
        } else {
            var serverAuth = {};
        }

        serverAuth[user.id] = { level: level };

        rclient.set("server:auth:" + server.id, JSON.stringify(serverAuth), function(err) {
            callback(err);
        });
    });
}
