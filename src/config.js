import dotenv from 'dotenv';

dotenv.config();

const config = {};

config.meme = process.env.BOT_MEME || 'butt';
config.minimumWordsBeforeButtification =
  parseInt(process.env.BOT_MINIMUM_BEFORE_BUTTIFY, 10) || 3;
config.wordsToPossiblyButt =
  parseInt(process.env.BOT_WORDS_TO_POSSIBLY_BUTT, 10) || 3;
config.chanceToButt = parseFloat(process.env.BOT_CHANCE, 10) || 0.2;
config.buttBuffer = parseInt(process.env.BOT_BUTT_BUFFER, 10) || 5;

// WARNING
// IF YOU CHANGE THIS THE POLICE CAN MAYBE TAKE YOU TO JAIL
config.breakTheFirstRuleOfButtbotics = false;

export default config;
