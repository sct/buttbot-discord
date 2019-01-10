/* eslint-disable consistent-return */
import db from '../db';
import Servers from './Servers';
import logger from '../logger';
import stats from './Stats';
import config from '../../config';

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
    });

  updateWhitelist = (channelName, remove) => {
    if (remove) {
      this.db.update({ _id: this.id }, { $pull: { whitelist: channelName } });
    } else {
      this.db.update(
        { _id: this.id },
        { $addToSet: { whitelist: channelName } }
      );
    }

    logger.debug(
      `Updating whitelist with: #${channelName} Removal: ${
        remove ? 'true' : 'false'
      }`
    );
  };

  getRoles = () =>
    new Promise((resolve, reject) => {
      this.db.findOne({ _id: this.id }, (err, server) => {
        if (!server) {
          return reject(new Error('Cant find server in database'));
        }

        // We do a conditional here incase the server record doesnt already have the
        // roles array
        return resolve(server.roles || []);
      });
    });

  updateRoles = (role, remove) => {
    if (remove) {
      this.db.update({ _id: this.id }, { $pull: { roles: role.id } });
    } else {
      this.db.update({ _id: this.id }, { $addToSet: { roles: role.id } });
    }

    logger.debug(
      `Updating access with: ${role.name} Removal: ${remove ? 'true' : 'false'}`
    );
  };

  trackButtification = () => {
    this.db.update({ _id: this.id }, { $inc: { buttifyCount: 1 } });
    stats.trackButtification();
  };

  getButtifyCount = () =>
    new Promise((resolve, reject) => {
      this.db.findOne({ _id: this.id }, (err, server) => {
        if (!server) {
          return reject(new Error('Cant find server in database'));
        }

        return resolve(server.buttifyCount || 0);
      });
    });

  setSetting = (name, value) => {
    const newSetting = {};

    newSetting[`settings.${name}`] = value;

    this.db.update({ _id: this.id }, { $set: newSetting });
  };

  getSetting = name =>
    new Promise((resolve, reject) => {
      this.db.findOne({ _id: this.id }, (err, server) => {
        if (!server) {
          return reject(new Error('Cant find server in database'));
        }

        if (!server.settings && !server.settings[name]) {
          return resolve(config[name]);
        }

        return resolve(server.settings[name]);
      });
    });

  getSettings = () =>
    new Promise((resolve, reject) => {
      this.db.findOne({ _id: this.id }, (err, server) => {
        if (!server) {
          return reject(new Error('Cant find server in database'));
        }

        if (!server.settings) {
          return resolve(config);
        }

        const settings = config;

        settings.chanceToButt =
          server.settings.chanceToButt || config.chanceToButt;
        settings.buttBuffer = server.settings.buttBuffer || config.buttBuffer;
        settings.buttAI = server.settings.buttAI === 0 ? 0 : config.buttAI;

        return resolve(settings);
      });
    });
}

export default Server;
