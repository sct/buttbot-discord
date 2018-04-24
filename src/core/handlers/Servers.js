import Server from './Server';
import db from '../db';
import logger from '../logger';

class Servers {
  constructor() {
    this.db = db.servers;
    this.servers = {};
  }

  createServer = serverId =>
    new Promise((resolve, reject) => {
      this.db.insert({
        _id: serverId,
        whitelist: [],
        muted: false,
        buttifyCount: 0,
      }, (err, newServer) => {
        if (newServer) {
          return resolve(newServer);
        }

        return reject(err);
      });
    });

  async getServer(serverId) {
    if (this.servers[serverId]) {
      return this.servers[serverId];
    }

    const server = new Server(serverId);

    if (!server.prepared) {
      await server.prepareServer()
        .then(preparedServer => logger.debug('Server Prepared', preparedServer))
        .catch(error => logger.error(error));
    }

    this.servers[serverId] = server;

    return server;
  }
}

const servers = new Servers();

export default servers;
