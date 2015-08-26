var config = {}

config.bot = {}
config.redis = {}

config.logging = process.env.NODE_LOGGING || 1;
config.logging_level = process.env.LOGGING_LEVEL || 'debug';

// Set to false to disable connecting to discord for debugging
config.bot.actuallyButt = true;

// Discord Username and password
config.bot.username = process.env.DISCORD_USERNAME
config.bot.password = process.env.DISCORD_PASSWORD

// Bot Configuration
config.bot.enableCommands = true;
config.bot.commandPrefix = "!";
config.bot.masterUserId = process.env.DISCORD_USER_ID; // User ID of main bot owner. Overrides all auth

// Buttify Configuration
config.meme = "butt";
config.chanceToButt = 0.80;
config.wordsToPossiblyButt = 3;
config.buttBuffer = 5;
config.minimumWordsBeforeButtification = 2;

// Redis Configuration
config.redis.host = process.env.REDIS_HOST || "localhost";
config.redis.port = process.env.REDIS_PORT || 6379;

// WARNING
// IF YOU CHANGE THIS THE POLICE CAN MAYBE TAKE YOU TO JAIL
config.breakTheFirstRuleOfButtbotics = false;

module.exports = config;
