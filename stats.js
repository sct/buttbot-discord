var config = require('./config');
var redis = require('redis');
var _ = require('underscore');

var rclient = redis.createClient(config.redis.port, config.redis.host);

var servers = {};
var prepObject = {
    buttifyCount: 0
}

var gStats = prepObject;

exports.init = function(bot) {
    _.each(bot.servers, function(server) {
        rclient.hgetall("stats:server:" + server.id, function(err, res) {
            if (err) {
                console.log("Error retrieving server stat information", err);
                return;
            }

            if (res) {
                servers[server.id] = res;
            } else {
                rclient.hmset("stats:server:" + server.id, prepObject);
                servers[server.id] = prepObject;
            }

        });
    });

    rclient.hgetall("stats:global", function(err, res) {
        if (err) {
            console.log("Error retrieving global stat information", err);
            return;
        }

        if (res) {
            gStats = res;
        } else {
            rclient.hmset("stats:global", prepObject);
        }
    })
}

exports.getStat = function(server, key) {
    if (servers[server.id]) {
        var server = servers[server.id];

        if (server[key]) {
            return server[key];
        } else {
            return 0;
        }
    }
}

exports.getGlobalStat = function(key) {
    if (gStats[key]) {
        return gStats[key];
    } else {
        return 0;
    }
}

exports.setStat = function(server, key, value) {
    if (servers[server.id]) {
        rclient.hset("stats:server:" + server.id, key, value);
        var server = servers[server.id];

        server[key] = value;

    }
}

exports.setGlobalStat = function(key, value) {
    rclient.hset("stats:global", key, value);
    gStats[key] = value;
}

exports.reset = function(server) {
    console.log(prepObject);
    if (servers[server.id]) {
        rclient.hmset("stats:server:" + server.id, prepObject);
        servers[server.id] = prepObject;
    }
}
