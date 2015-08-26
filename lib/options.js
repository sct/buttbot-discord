var config = require('../config');
var redis = require('redis');
var _ = require('underscore');

var rclient = redis.createClient(config.redis.port, config.redis.host);

var servers = {};
var prepObject = {
    muted: false,
    mutedChannels: []
}

exports.init = function(bot) {
    _.each(bot.servers, function(server) {
        rclient.hgetall("options:server:" + server.id, function(err, res) {
            if (err) {
                console.log("Error retrieving server option information", err);
                return;
            }

            if (res) {
                servers[server.id] = res;
            } else {
                rclient.hmset("options:server:" + server.id, prepObject);
                servers[server.id] = prepObject;
            }

        });
    });
}

exports.getOption = function(server, key) {
    if (servers[server.id]) {
        var server = servers[server.id];

        if (server[key]) {
            return server[key];
        } else {
            return null;
        }
    }
}

exports.setOption = function(server, key, value) {
    if (servers[server.id]) {
        rclient.hset("options:server:" + server.id, key, value);
        var server = servers[server.id];

        server[key] = value;
        console.log("Set " + key + " to " + value);
    }
}
