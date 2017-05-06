var Logger = require(__dirname + "/lib/Logger.js");
var Def = require(__dirname + "/lib/Def.js");
Logger.Level = Def.LoggerLevel;
Logger.Color = Def.Color;
module.exports = Logger;