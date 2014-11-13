var _ = require("underscore");

function BuiltInLoggerImpl() {}
BuiltInLoggerImpl._start = Date.now();
BuiltInLoggerImpl.isVerbose = function(level) {
	return level <= BuiltInLoggerImpl._maxLevel;
}

// TODO: Add format options
BuiltInLoggerImpl.elapsed = function() {
	var elapsed = Date.now() - BuiltInLoggerImpl._start;

	var tim = String(elapsed%1000);
	while(tim.length < 3)
		tim = "0" + tim;
	tim = (elapsed = Math.floor(elapsed/1000))%60 + "." + tim;
	while(tim.length < 6)
		tim = "0" + tim;
	tim = (elapsed = Math.floor(elapsed/60))%60 + ":" + tim;
	while(tim.length < 9)
		tim = "0" + tim;
	tim = (elapsed = Math.floor(elapsed/60))%60 + ":" + tim;
	while(tim.length < 12)
		tim = "0" + tim;
	tim = (elapsed = Math.floor(elapsed/24))%24 + " " + tim;
	while(tim.length < 15)
		tim = "0" + tim;

	return tim;
}
    
BuiltInLoggerImpl.write = function(message, out) {
	try {
		if(!_.isString(message))
			throw "Not a string";
		out.write("" + message);
	} catch(e) {
		var obj = _.isObject(message);
		if(obj) {
			var type = message.constructor.name;
			if(obj = (type != "Object" && type != "Array")) {
				out.write(type);
				out.write("(");
			}
		}
		try {
			if (message instanceof RegExp)
				throw "RegExp";
			out.write(JSON.stringify(message));
		} catch(e) {
			out.write("" + message);
		}
		if(obj)
			out.write(")");
	}
}

// Inherit from LoggerImpl
BuiltInLoggerImpl.prototype = new (require(require("path").resolve(__dirname, "impl.js")))();

var LoggerLevel = require(require("path").resolve(__dirname, "level.js"));
var defaultLevel = LoggerLevel.Performance;
if(process.env.VERBOSE) {
    var verbose = parseFloat(process.env.VERBOSE);
    if(isFinite(verbose) && !isNaN(verbose))
        BuiltInLoggerImpl._maxLevel = verbose;
    else {
        verbose = process.env.VERBOSE;
        verbose = verbose.substring(0, 1).toUpperCase() + verbose.substring(1).toLowerCase();
        if(!(verbose in LoggerLevel)) {
            console.warn(process.env.VERBOSE + " is not a valid logger verbosity setting.");
			BuiltInLoggerImpl._maxLevel = defaultLevel;
		} else
        	BuiltInLoggerImpl._maxLevel = LoggerLevel[verbose];
    }
} else if(process.env.NODE_ENV && process.env.NODE_ENV == "test") // Don't crowd testing output
    BuiltInLoggerImpl._maxLevel = LoggerLevel.Silent;
else
    BuiltInLoggerImpl._maxLevel = defaultLevel;

module.exports = BuiltInLoggerImpl;