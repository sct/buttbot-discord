import DataStore from 'nedb';

const db: { servers: DataStore; words: DataStore } = {
  servers: new DataStore('db/servers.db'),
  words: new DataStore('db/words.db'),
};

export default db;
