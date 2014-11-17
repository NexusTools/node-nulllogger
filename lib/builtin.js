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

BuiltInLoggerImpl.levelStr = function(level) {
	switch(level) {
		case LoggerLevel.Gears:
			return "Gears";
			break;

		case LoggerLevel.Debug:
			return "Debug";
			break;

		case LoggerLevel.Perf:
			return "Perf ";
			break;

		case LoggerLevel.Timer:
			return "Timer";
			break;

		case LoggerLevel.Info:
			return "Info ";
			break;

		case LoggerLevel.Warn:
			return "Warn ";
			break;

		case LoggerLevel.Error:
			return "Error";
			break;

		case LoggerLevel.Fatal:
			return "Fatal";
			break;

		default:
			return " ??? ";
			break;

	}
}
    
BuiltInLoggerImpl.stringForObject = function(object) {
	try {
		if(_.isString(object))
			return "" + object;
		throw "Not a string";
	} catch(e) {
		var str = "";
		var obj = _.isObject(object);
		if(obj) {
			var type = object.constructor.name;
			if(obj = (type != "Object" && type != "Array" && !(object instanceof Error))) {
				str += type;
				str += "(";
			}
		}
		try {
			if (object instanceof RegExp)
				throw "RegExp";
			try {
				if(object instanceof Error)
					str += object.stack;
			} catch(e) {
				str += JSON.stringify(object);
			}
		} catch(e) {
			str += "" + object;
		}
		if(obj)
			str += ")";
		
		return str;
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
    BuiltInLoggerImpl._maxLevel = LoggerLevel.Warning;
else
    BuiltInLoggerImpl._maxLevel = defaultLevel;

module.exports = BuiltInLoggerImpl;