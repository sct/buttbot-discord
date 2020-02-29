/* eslint-disable consistent-return */
import db from '../db';
import Servers from './Servers';
import logger from '../logger';
import stats from './Stats';
import config, { ButtBotConfig } from '../../config';
import { Role } from 'discord.js';

export interface ServerType {
  _id: string;
  whitelist: string[];
  roles: string[];
  muted: boolean;
  buttifyCount: number;
  settings?: ButtBotConfig;
}

class Server {
  private db = db.servers;
  public id: string;
  public prepared = false;
  public lock = 0;

  public constructor(serverId: string) {
    this.id = serverId;
  }

  public async prepareServer(): Promise<ServerType> {
    return new Promise((resolve, reject): void => {
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

  public getWhitelist = (): Promise<string[]> =>
    new Promise((resolve, reject): void => {
      this.db.findOne({ _id: this.id }, (err: Error, server: ServerType) => {
        if (!server) {
          return reject(new Error('Cant find server in database'));
        }

        return resolve(server.whitelist);
      });
    });

  public updateWhitelist = (channelName: string, remove: boolean): void => {
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

  public getRoles = (): Promise<string[]> =>
    new Promise((resolve, reject): void => {
      this.db.findOne({ _id: this.id }, (err, server: ServerType) => {
        if (!server) {
          return reject(new Error('Cant find server in database'));
        }

        // We do a conditional here incase the server record doesnt already have the
        // roles array
        return resolve(server.roles || []);
      });
    });

  public updateRoles = (role: Role, remove: boolean): void => {
    if (remove) {
      this.db.update({ _id: this.id }, { $pull: { roles: role.id } });
    } else {
      this.db.update({ _id: this.id }, { $addToSet: { roles: role.id } });
    }

    logger.debug(
      `Updating access with: ${role.name} Removal: ${remove ? 'true' : 'false'}`
    );
  };

  public trackButtification = (): void => {
    this.db.update({ _id: this.id }, { $inc: { buttifyCount: 1 } });
    stats.trackButtification();
  };

  public getButtifyCount = (): Promise<number> =>
    new Promise((resolve, reject): void => {
      this.db.findOne({ _id: this.id }, (err, server: ServerType) => {
        if (!server) {
          return reject(new Error('Cant find server in database'));
        }

        return resolve(server.buttifyCount || 0);
      });
    });

  public setSetting = (name: string, value: string | number): void => {
    const newSetting = {};

    newSetting[`settings.${name}`] = value;

    this.db.update({ _id: this.id }, { $set: newSetting });
  };

  public getSetting = (
    name: string
  ): Promise<ButtBotConfig[keyof ButtBotConfig]> =>
    new Promise((resolve, reject): void => {
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

  public getSettings = (): Promise<ButtBotConfig> =>
    new Promise((resolve, reject): void => {
      this.db.findOne({ _id: this.id }, (err, server: ServerType) => {
        if (!server) {
          return reject(new Error('Cant find server in database'));
        }

        if (!server.settings) {
          return resolve(config);
        }

        const settings: Partial<ButtBotConfig> = {};

        settings.chanceToButt =
          server.settings.chanceToButt || config.chanceToButt;
        settings.buttBuffer = server.settings.buttBuffer || config.buttBuffer;
        settings.buttAI = server.settings.buttAI === 0 ? 0 : config.buttAI;

        const mergedSettings = Object.assign({}, config, settings);

        return resolve(mergedSettings);
      });
    });
}

export default Server;
