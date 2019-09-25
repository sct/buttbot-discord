import db from '../db';

class Stats {
  private db = db.servers;

  public trackButtification = (): void => {
    this.db.update({ _id: 1 }, { $inc: { buttifyCount: 1 } }, { upsert: true });
  };

  public getButtifyCount = (): Promise<number> =>
    new Promise((resolve): void => {
      this.db.findOne({ _id: 1 }, (err, stats: { buttifyCount: number }) => {
        if (!stats) {
          return resolve(0);
        }

        return resolve(stats.buttifyCount || 0);
      });
    });
}

const stats = new Stats();

export default stats;
