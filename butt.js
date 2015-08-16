var config = require('./config');
var _ = require('underscore');
var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: config.logging_level })
  ]
});

buttify("The quick brown fox jumped over the lazy dog.");

function buttify(string) {
  // Separate the string into an array
  var split = prepareForButtification(string);
  log("info", split);

  _.each(split, function(word, index) {
    log("debug", word);
    split[index] = config.meme;
  });

  log("debug", "Buttifier", split);
  // Run through the array and choose indices for replacing

  // Determine if chosen words can be buttified
  // - Is the word a stop word (I'm, You're, You, I, etc)
  // - Is the word long enough? (More than 3 characters)

  // Determine if the word has pluralization
  // - Shoes = Butts
  // - Shoe = Butt
  // - Boats = Butts
  // - Boating = Butting

  // Replace words and compare to original string. Determine butting
  // threshold. Did we butt too much? Abandon all hope.

  // Make sure it doesnt match original input string. We had to have
  // buttified at least one thing.

  // Final chance to actually buttify (Probably run this first)

  // Output
}

/**
 * Separate string in preparation for butiffication
 *
 * @param  {string} string String input
 * @return {array}        Array. Ready to buttify
 */
function prepareForButtification(string) {
  var original = string;

  var trimmed = string.trim();
  var split = trimmed.split(" ");

  return split;
}


function log(level, system, msg, meta) {
	if (config.logging && config.logging != 0) {

		if (meta) {
			logger.log(level, '[ButtJS]' + msg, meta);
		} else {
			logger.log(level, '[ButtJS]' + msg);
		}
	}
}
