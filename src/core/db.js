import DataStore from 'nedb';

const db = {};

db.servers = new DataStore('db/servers.db');

export default db;
