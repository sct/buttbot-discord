import Server, { ServerType } from './Server';
import db from '../db';
import logger from '../logger';

class Servers {
  db = db.servers;
  servers = {};

  createServer = (serverId: string): Promise<ServerType> =>
    new Promise((resolve, reject) => {
      this.db.insert(
        {
          _id: serverId,
          whitelist: [],
          roles: [],
          muted: false,
          buttifyCount: 0,
        },
        (err, newServer: ServerType) => {
          if (newServer) {
            return resolve(newServer);
          }

          return reject(err);
        }
      );
    });

  async getServer(serverId: string): Promise<Server> {
    if (this.servers[serverId]) {
      return this.servers[serverId];
    }

    const server = new Server(serverId);

    if (!server.prepared) {
      await server
        .prepareServer()
        .then(preparedServer => logger.debug('Server Prepared', preparedServer))
        .catch(error => logger.error(error));
    }

    this.servers[serverId] = server;

    return server;
  }
}

const servers = new Servers();

export default servers;
