import dotenv from 'dotenv';

dotenv.config();

const config = {};

config.meme = process.env.BOT_MEME || 'butt';
config.minimumWordsBeforeButtification =
  Number(process.env.BOT_MINIMUM_BEFORE_BUTTIFY) || 3;
config.wordsToPossiblyButt =
  Number(process.env.BOT_WORDS_TO_POSSIBLY_BUTT) || 3;
config.negativeThreshold = Number(process.env.BOT_NEGATIVE_THRESHOLD) || -10;
config.chanceToButt = parseFloat(process.env.BOT_CHANCE, 10) || 0.2;
config.buttBuffer = Number(process.env.BOT_BUTT_BUFFER) || 5;
config.buttAI = 1;

// WARNING
// IF YOU CHANGE THIS THE POLICE CAN MAYBE TAKE YOU TO JAIL
config.breakTheFirstRuleOfButtbotics = false;

export default config;
