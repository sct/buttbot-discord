var config = {}

config.logging = process.env.NODE_LOGGING || 1;
config.logging_level = process.env.LOGGING_LEVEL || 'debug';

// Set to false to disable connecting to discord for debugging
config.actuallyButt = true;

// Buttify configuration
config.meme = "butt";
config.chanceToButt = 0.70;
config.wordsToPossiblyButt = 3;

// WARNING
// IF YOU CHANGE THIS THE POLICE CAN MAYBE TAKE YOU TO JAIL
config.breakTheFirstRuleOfButtbotics = false;

module.exports = config;
