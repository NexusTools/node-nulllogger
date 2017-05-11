var Logger = require("./lib/logger.js");
var Def = require("./lib/def.js");
Logger.Level = Def.LoggerLevel;
Logger.Color = Def.Color;
module.exports = Logger;