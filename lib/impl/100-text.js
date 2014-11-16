function TextLoggerImpl() {}

var path = require("path");
var topDir = path.dirname(__dirname);
var BuiltInLoggerImpl = require(path.resolve(topDir, "builtin.js"));
var LoggerLevel = require(path.resolve(topDir, "level.js"));
TextLoggerImpl.prototype = new BuiltInLoggerImpl();

TextLoggerImpl.prototype.log = function(level, scopes, messages, out) {
	if(!BuiltInLoggerImpl.isVerbose(level))
		return;

	out.write("[");
	out.write(BuiltInLoggerImpl.levelStr(level));
	out.write(" ");
	out.write(BuiltInLoggerImpl.elapsed());
	out.write("]");

	scopes.forEach(function(scope){
		out.write(" *");
		out.write(scope[1]);
		out.write("*");
	});
	
	messages.forEach(function(message){
		out.write(" ");
		BuiltInLoggerImpl.write(message, out);
	});
	out.write("\n");
};

module.exports = TextLoggerImpl;