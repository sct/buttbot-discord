import db from '../db';
import Servers from './Servers';
import logger from '../logger';

class Server {
  constructor(serverId) {
    this.id = serverId;
    this.db = db.servers;
    this.prepared = false;
    this.lock = 0;
  }

  async prepareServer() {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: this.id }, (err, server) => {
        if (!server) {
          Servers.createServer(this.id)
            .then(newServer => {
              this.prepared = true;
              return resolve(newServer);
            })
            .catch(e => reject(e));
        } else {
          this.prepared = true;
          return resolve(server);
        }
      });
    });
  }

  getWhitelist = () =>
    new Promise((resolve, reject) => {
      this.db.findOne({ _id: this.id }, (err, server) => {
        if (!server) {
          return reject(new Error('Cant find server in database'));
        }

        return resolve(server.whitelist);
      });
    })

  updateWhitelist = (channelName, remove) => {
    if (remove) {
      this.db.update({ _id: this.id }, { $pull: { whitelist: channelName } });
    } else {
      this.db.update({ _id: this.id }, { $addToSet: { whitelist: channelName } });
    }

    logger.debug(`Updating whitelist with: #${channelName} Removal: ${remove ? 'true' : 'false'}`);
  }
}

export default Server;
