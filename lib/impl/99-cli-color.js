function TextLoggerImpl() {}

var path = require("path");
var clc = require("cli-color");
var topDir = path.dirname(__dirname);
var Color = require(path.resolve(topDir, "color.js"));
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
			color = clc.blueBright;
			break;

		case LoggerLevel.Info:
			color = clc.whiteBright;
			break;

		case LoggerLevel.Warn:
			color = clc.yellowBright;
			break;

		case LoggerLevel.Error:
		case LoggerLevel.Fatal:
			color = clc.redBright;
			break;

		default:
			color = clc.white;
			break;

	}

	var pre = "[" + BuiltInLoggerImpl.levelStr(level) + " " + BuiltInLoggerImpl.elapsed() + "]";
	out.write(color(pre));

	scopes.forEach(function(scope){
		out.write(" ");
		
		var color;
		if(scope[0] in Color)
			color = clc[Color[scope[0]].toLowerCase() + "Bright"];
		else {
			if(isNaN(scope[0]))
				color = clc.xterm(parseInt(scope[0].substring(1), 16));
			else
				color = clc.xterm(scope[0]*1);
		}
		
		//out.write(color);
		out.write((color || clc.magentaBright)("*" + scope[1] + "*"));
	});
	messages.forEach(function(message){
		out.write(" ");
		BuiltInLoggerImpl.write(message, out);
	});
	out.write("\n");
};

module.exports = TextLoggerImpl;