if(!process.env.PROCESS_SEND_LOGGER)
    throw new Error("Not enabled");
if(!process.send)
	throw new Error("process.send missing, are you a worker?");

function ProcessSendLoggerImpl() {}

var path = require("path");
var topDir = path.dirname(__dirname);
var LoggerImpl = require(path.resolve(topDir, "impl.js"));
var BuiltInLoggerImpl = require(path.resolve(topDir, "builtin.js"));
ProcessSendLoggerImpl.prototype = new LoggerImpl();

ProcessSendLoggerImpl.prototype.log = function(level, scopes, messages, out) {
	try {
		var processedMessages = [];
		messages.forEach(function(message) {
			processedMessages.push(BuiltInLoggerImpl.stringForObject(message));
		});
		
    	process.send({
			"receiver": "Logger",
			"data": [level, scopes, processedMessages]
		});
	} catch(e) {
		console.error(e);
		console.error(arguments);
	}
};
ProcessSendLoggerImpl.prototype.shouldAsync = function(l) {
	return false;
};

module.exports = ProcessSendLoggerImpl;