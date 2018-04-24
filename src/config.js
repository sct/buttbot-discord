import dotenv from 'dotenv';

dotenv.config();

const config = {};

config.meme = process.env.BOT_MEME || 'butt';
config.minimumWordsBeforeButtification = process.env.BOT_MINIMUM_BEFORE_BUTTIFY || 2;
config.wordsToPossiblyButt = process.env.BOT_WORDS_TO_POSSIBLY_BUTT || 3;

// WARNING
// IF YOU CHANGE THIS THE POLICE CAN MAYBE TAKE YOU TO JAIL
config.breakTheFirstRuleOfButtbotics = false;

export default config;
