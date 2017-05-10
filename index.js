var Logger = require(__dirname + "/lib/logger.js");
var Def = require(__dirname + "/lib/def.js");
Logger.Level = Def.LoggerLevel;
Logger.Color = Def.Color;
module.exports = Logger;