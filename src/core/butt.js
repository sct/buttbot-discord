import Hypher from 'hypher';
import english from 'hyphenation.en-us';
import validUrl from 'valid-url';

import config from '../config';
import logger from './logger';
import stopwords from './stopwords';

const h = new Hypher(english);

/**
 * Separate string in preparation for butiffication
 *
 * @param  {string} string String input
 * @return {array} Ready to buttify
 */
const prepareForButtification = (string) => {
  const trimmed = string.trim();
  const split = trimmed.split(' ');

  return split;
};

/**
 * Rejoin string after done buttifying
 *
 * @param  {Array} split Array of updated string
 * @return {string}
 */
function finishButtification(split) {
  return split.join(' ');
}

/**
* Capitalize the first letter of a word
*
* @param  {string} string Word to capitalize
* @return {string}
*/
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
* Determine if word should be butted
*
* @param  {string} string  Stripped version of the word
* @return {bool}
*/
const shouldWeButt = (string) => {
  // Is the word the same as our meme?
  if (string.toLowerCase() === config.meme) {
    return false;
  }

  // Is the word a stop word?
  let stopWordExists = false;
  stopwords.forEach((word) => {
    if (string.toLowerCase() === word.toLowerCase()) {
      stopWordExists = true;
    }
  });

  if (stopWordExists) {
    return false;
  }

  // Is the word a URL?
  if (validUrl.isUri(string)) {
    return false;
  }

  return true;
};

/**
 * Did we actually change the string at all?
 *
 * @param  {string} original  Original version of the string
 * @param  {string} newString Possibly buttified version of the string
 * @return {bool}
 */
const didWeActuallyButt = (original, newString) => {
  if (original === newString) {
    return false;
  }

  return true;
};

const subButt = (word) => {
  const ogWord = word;
  let buttWord = config.meme;

  const punc = word.match(/^([^A-Za-z]*)(.*?)([^A-Za-z]*)$/);

  const pS = punc[1];
  const sWord = punc[2];
  const pE = punc[3];

  if (!shouldWeButt(sWord)) {
    return ogWord;
  }

  const hyphenated = h.hyphenate(sWord);

  if (sWord === sWord.toUpperCase()) {
    buttWord = buttWord.toUpperCase();
  }

  if (hyphenated.length > 1) {
    const swapIndex = Math.floor(Math.random() * hyphenated.length);

    if (swapIndex === 0 && sWord.match(/^[A-Z]/)) {
      buttWord = capitalizeFirstLetter(buttWord);
    }
    hyphenated[swapIndex] = buttWord;

    buttWord = hyphenated.join('');
  } else if (sWord.match(/^[A-Z]/)) {
    buttWord = capitalizeFirstLetter(buttWord);
  }

  return pS + buttWord + pE;
};

const buttify = (string) =>
  new Promise((resolve, reject) => {
    const originalString = string;
    const buttdex = [];
    let err = null;

    // Separate the string into an array
    const split = prepareForButtification(string);

    if (split.length < config.minimumWordsBeforeButtification) {
      err = {
        failed: true,
        msg: 'Not enough words to buttify',
      };
      return reject(err);
    }

    logger.debug(`Test Hyphenation Result: ${h.hyphenateText(string)}`);

    // Choose words to buttify. Super simple here. Just chance to select random
    // words from the string. Eventually we want to weight them and pick them
    // that way but for now this will work.
    //
    // As of now we use wordsToPossiblyButt as a factor for buttification chance.
    // If a sentance has 9 words it will be divided by the chance to possibly butt
    // and has 3 chances to have butts in it. This means sentances shorter
    // than the chance to butt will never be buttified.
    //
    // We also check to make sure this index hasn't been buttified already!
    for (
      let x = 0;
      x < (Math.floor(Math.random() * (Math.floor(split.length / config.wordsToPossiblyButt))) + 1);
      x += 1
    ) {
      const rndIndex = Math.floor(Math.random() * split.length);
      const word = split[rndIndex];

      if (!buttdex.includes(rndIndex)) {
        split[rndIndex] = subButt(word);
        buttdex.push(rndIndex);
      }
    }
    // Replace words and compare to original string. Determine butting
    // threshold. Did we butt too much? Abandon all hope.

    // Make sure it doesnt match original input string. We had to have
    // buttified at least one thing.
    const final = finishButtification(split);

    if (!didWeActuallyButt(originalString, final)) {
      err = {
        failed: true,
        msg: 'We didn\'t buttify anything! Abort!',
      };
    }

    // Output if no error
    if (err) {
      return reject(err);
    }

    return resolve(final);
  });

export default buttify;
