import db from '../db';

export type WordType = {
  _id: string;
  original: string;
  buttified: string;
  score: number;
};

class Words {
  db = db.words;

  createWord = (word: string, buttified: string): Promise<WordType> =>
    new Promise((resolve, reject) => {
      this.db.insert(
        {
          _id: word,
          original: word,
          buttified,
          score: 0,
        },
        (err, newWord: WordType) => {
          if (newWord) {
            return resolve(newWord);
          }

          return reject(err);
        }
      );
    });

  getWord = ({ word, buttified }): Promise<WordType> =>
    new Promise(resolve => {
      this.db.findOne({ _id: word }, async (err, fetchedWord: WordType) => {
        if (!fetchedWord) {
          const newWord = await this.createWord(word, buttified);
          resolve(newWord);
        }

        return resolve(fetchedWord);
      });
    });

  getWords = (words: string[]): Promise<WordType[]> =>
    new Promise((resolve, reject) => {
      this.db.find(
        { original: { $in: words } },
        (err, fetchedWords: WordType[]) => {
          if (err) {
            reject(err);
          }

          return resolve(fetchedWords.sort((a, b) => b.score - a.score));
        }
      );
    });

  updateScore = async (
    word: { word: string; buttified: string },
    score: number
  ): Promise<void> => {
    const fetchedWord = await this.getWord(word);

    this.db.update({ original: fetchedWord.original }, { $inc: { score } });
  };
}

const words = new Words();

export default words;
