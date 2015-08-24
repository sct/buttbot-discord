var config = {}

config.bot = {}

config.logging = process.env.NODE_LOGGING || 1;
config.logging_level = process.env.LOGGING_LEVEL || 'debug';

// Set to false to disable connecting to discord for debugging
config.bot.actuallyButt = true;

// Discord Username and password
config.bot.username = process.env.DISCORD_USERNAME
config.bot.password = process.env.DISCORD_PASSWORD

// Buttify configuration
config.meme = "butt";
config.chanceToButt = 0.80;
config.wordsToPossiblyButt = 3;
config.buttBuffer = 5;
config.minimumWordsBeforeButtification = 2;

// WARNING
// IF YOU CHANGE THIS THE POLICE CAN MAYBE TAKE YOU TO JAIL
config.breakTheFirstRuleOfButtbotics = false;

module.exports = config;
