import db from '../db';
import logger from '../logger';

class Words {
  constructor() {
    this.db = db.words;
  }

  createWord = (word, buttified) =>
    new Promise((resolve, reject) => {
      this.db.insert(
        {
          _id: word,
          original: word,
          buttified,
          score: 0
        },
        (err, newWord) => {
          if (newWord) {
            return resolve(newWord);
          }

          return reject(err);
        }
      );
    });

  getWord = ({ word, buttified }) =>
    new Promise((resolve, reject) => {
      this.db.findOne({ _id: word }, async (err, fetchedWord) => {
        if (!fetchedWord) {
          const newWord = await this.createWord(word, buttified);
          resolve(newWord);
        }

        return resolve(fetchedWord);
      });
    });

  getWords = words =>
    new Promise((resolve, reject) => {
      this.db.find(
        { word: { $in: words.map(({ word }) => word) } },
        (err, fetchedWords) => {
          if (err) {
            reject(err);
          }

          return resolve(fetchedWords);
        }
      );
    });

  updateScore = async (word, score) => {
    const fetchedWord = await this.getWord(word);

    this.db.update({ original: fetchedWord.original }, { $inc: { score } });
  };
}

const words = new Words();

export default words;
