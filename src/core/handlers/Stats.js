import db from '../db';

class Stats {
  constructor() {
    this.db = db.servers;
  }

  trackButtification = () => {
    this.db.update({ _id: 1 }, { $inc: { buttifyCount: 1 } }, { upsert: true });
  };

  getButtifyCount = () =>
    new Promise(resolve => {
      this.db.findOne({ _id: 1 }, (err, stats) => {
        if (!stats) {
          return resolve(0);
        }

        return resolve(stats.buttifyCount || 0);
      });
    });
}

const stats = new Stats();

export default stats;
