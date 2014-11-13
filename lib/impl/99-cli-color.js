function TextLoggerImpl() {}

var path = require("path");
var clc = require("cli-color");
var topDir = path.dirname(__dirname);
var BuiltInLoggerImpl = require(path.resolve(topDir, "builtin.js"));
var LoggerLevel = require(path.resolve(topDir, "level.js"));
TextLoggerImpl.prototype = new BuiltInLoggerImpl();

TextLoggerImpl.prototype.log = function(level, scopes, messages, out) {
	if(!BuiltInLoggerImpl.isVerbose(level))
		return;

	var color;
	switch(level) {
		case LoggerLevel.Perf:
		case LoggerLevel.Timer:
			color = clc.blue;
			break;

		case LoggerLevel.Info:
			color = clc.cyan;
			break;

		case LoggerLevel.Warn:
			color = clc.yellow;
			break;

		case LoggerLevel.Error:
		case LoggerLevel.Fatal:
			color = clc.red;
			break;

		default:
			color = clc.white;
			break;

	}

	var levelStr
	switch(level) {
		case LoggerLevel.Gears:
			levelStr = "Gears";
			break;

		case LoggerLevel.Debug:
			levelStr = "Debug";
			break;

		case LoggerLevel.Perf:
			levelStr = "Perf ";
			break;

		case LoggerLevel.Timer:
			levelStr = "Timer";
			break;

		case LoggerLevel.Info:
			levelStr = "Info ";
			break;

		case LoggerLevel.Warn:
			levelStr = "Warn ";
			break;

		case LoggerLevel.Error:
			levelStr = "Error";
			break;

		case LoggerLevel.Fatal:
			levelStr = "Fatal";
			break;

		default:
			levelStr = " ??? ";
			break;

	}
	out.write(color(BuiltInLoggerImpl.elapsed()));
	out.write(" ");
	out.write(color(levelStr));

	scopes.forEach(function(scope){
		out.write(" ");
		out.write(clc.magenta(scope));
	});
	messages.forEach(function(message){
		out.write(" ");
		BuiltInLoggerImpl.write(message, out);
	});
	out.write("\n");
};

module.exports = TextLoggerImpl;