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

	var color, strColor = function(data){return data;};
	switch(level) {
		case LoggerLevel.Perf:
		case LoggerLevel.Timer:
			color = clc.blue;
			break;

		case LoggerLevel.Info:
			color = strColor;
			break;

		case LoggerLevel.Warn:
			color = clc.yellow;
			break;

		case LoggerLevel.Error:
		case LoggerLevel.Fatal:
			color = clc.red;
			break;
			
		case LoggerLevel.Debug:
			color = clc.white;
			strColor = color;
			break;

		default:
			color = clc.blackBright;
			strColor = color;
			break;

	}

	var pre = "[" + BuiltInLoggerImpl.levelStr(level) + " " + BuiltInLoggerImpl.elapsed() + "]";
	out.write(color(pre));

	scopes.forEach(function(scope){
		out.write(" ");
		
		var color;
		if(scope[0] in Color) {
			color = Color[scope[0]].toLowerCase();
			if(color == "black")
				color = clc["blackBright"];
			else
				color = clc[color];
		} else {
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
		out.write(strColor(BuiltInLoggerImpl.stringForObject(message, out)));
	});
	out.write("\n");
};

module.exports = TextLoggerImpl;