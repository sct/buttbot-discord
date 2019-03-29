/* eslint-disable consistent-return */
import db from '../db';
import Servers from './Servers';
import logger from '../logger';
import stats from './Stats';
import config, { ButtBotConfig } from '../../config';
import { Role } from 'discord.js';

export type ServerType = {
  _id: string;
  whitelist: string[];
  roles: string[];
  muted: boolean;
  buttifyCount: number;
  settings: ButtBotConfig
}

class Server {
  id: string;
  db = db.servers;
  prepared: boolean = false;
  lock: number = 0;

  constructor(serverId: string) {
    this.id = serverId;
  }

  async prepareServer(): Promise<ServerType> {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: this.id }, (err, server: ServerType) => {
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

  getWhitelist = (): Promise<string[]> =>
    new Promise((resolve, reject) => {
      this.db.findOne({ _id: this.id }, (err: Error, server: ServerType) => {
        if (!server) {
          return reject(new Error('Cant find server in database'));
        }

        return resolve(server.whitelist);
      });
    });

  updateWhitelist = (channelName: string, remove: boolean): void => {
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

  getRoles = (): Promise<string[]> =>
    new Promise((resolve, reject) => {
      this.db.findOne({ _id: this.id }, (err, server: ServerType) => {
        if (!server) {
          return reject(new Error('Cant find server in database'));
        }

        // We do a conditional here incase the server record doesnt already have the
        // roles array
        return resolve(server.roles || []);
      });
    });

  updateRoles = (role: Role, remove: boolean): void => {
    if (remove) {
      this.db.update({ _id: this.id }, { $pull: { roles: role.id } });
    } else {
      this.db.update({ _id: this.id }, { $addToSet: { roles: role.id } });
    }

    logger.debug(
      `Updating access with: ${role.name} Removal: ${remove ? 'true' : 'false'}`
    );
  };

  trackButtification = (): void => {
    this.db.update({ _id: this.id }, { $inc: { buttifyCount: 1 } });
    stats.trackButtification();
  };

  getButtifyCount = (): Promise<number> =>
    new Promise((resolve, reject) => {
      this.db.findOne({ _id: this.id }, (err, server: ServerType) => {
        if (!server) {
          return reject(new Error('Cant find server in database'));
        }

        return resolve(server.buttifyCount || 0);
      });
    });

  setSetting = (name: string, value: any): void => {
    const newSetting = {};

    newSetting[`settings.${name}`] = value;

    this.db.update({ _id: this.id }, { $set: newSetting });
  };

  getSetting = (name: string) =>
    new Promise((resolve, reject) => {
      this.db.findOne({ _id: this.id }, (err, server: ServerType) => {
        if (!server) {
          return reject(new Error('Cant find server in database'));
        }

        if (!server.settings && !server.settings[name]) {
          return resolve(config[name]);
        }

        return resolve(server.settings[name]);
      });
    });

  getSettings = (): Promise<ButtBotConfig> =>
    new Promise((resolve, reject) => {
      this.db.findOne({ _id: this.id }, (err, server: ServerType) => {
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
