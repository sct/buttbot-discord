import DataStore from 'nedb';

const db = {};

db.servers = new DataStore('db/servers.db');
db.words = new DataStore('db/words.db');

export default db;
