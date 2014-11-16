var path = require("path");
var _ = require("underscore");

var Logger = function() {
	var scopes = Logger.cleanScopes(Array.prototype.slice.call(arguments, 0));
	if(!(this instanceof Logger)) {
		var instance = new Logger();
		instance._scopes = scopes;
		return instance;
	}

	this._scopes = scopes;
}


// Imports and helpers
Logger.Level = require(path.resolve(__dirname, "level.js")),
Logger.Color = require(path.resolve(__dirname, "color.js")),

Logger.Helpers = {
	Impl: require(path.resolve(__dirname, "impl.js")),
	BuiltIn: require(path.resolve(__dirname, "builtin.js"))
};

// Scan and choose an implementation to use
Logger._init = function LoggerInit() {
	var implName = process.env.LOGGER_IMPL ||
					require(path.resolve(require.main.id,
						"package.json")).loggerImpl || false;

	var plugins = [];
	var pluginsByName = {};
	var pluginFormat = /^(\d+)\-(.+)\.js$/;
	var pluginDir = path.resolve(__dirname, "impl");
	require("fs").readdirSync(pluginDir).forEach(function(file) {
		var matches = file.match(pluginFormat);
		if(matches) {
			plugins.push([matches[1]*1, file]);
			pluginsByName[matches[2]] = file;
		}
	});
	plugins.sort(function(a, b){return a[0]-b[0]});

	var $break = new Object();
	var _impl, plugin, errors = {};
	try {
		if(!pluginName)
			throw "No desired plugin specified, must auto-detect.";
		
		plugin = require(path.resolve(pluginDir, pluginsByName[pluginName]));
		_impl = new plugin();
	} catch(e) {
		try {
			plugins.forEach(function(plugin) {
				try {
					var logImpl = require(path.resolve(pluginDir, plugin[1]));
					_impl = new logImpl();
				} catch(e) {
					errors[plugin[1]] = e;
					return;
				}
				throw $break;
			});
		} catch(e) {
			if(e !== $break)
				throw e;
		}
	}
	delete plugin;
	
	if(!_impl) {
		for(var filename in errors) {
			process.stderr.write("Failed to load `");
			process.stderr.write(filename);
			process.stderr.write("`: ");
			console.error(errors[filename].stack);
		}
		
		throw new Error("Failed to load logging implementation.");
	}
	
	if(!process.env.LOGGER_NEVER_ASYNC && _impl.shouldAsync()) {
		// Wrap the real implementation in a setTimeout(0)
		var realImpl = _impl;
		_impl = {
			"log": function() {
				/*
				  Pass exactly as it occurs this way
				  we dont need to update this if the API changes.
				*/
				var args = arguments;
				setTimeout(function() {
					realImpl.log.apply(realImpl, args);
				}, 0).ref(); // ensure the process doesn't die until the log is empty
			},
			"_impl": realImpl
		};
	}
	
	// Not needed anymore
	delete Logger._init;
	
	return _impl;
}

// Get the output stream for a given level
Logger._out = function LoggerDefaultStreamProvider(level) {
	if(level >= Logger.Level.Warn)
		return process.stderr;
	else
		return process.stdout;
}

Logger.hexRegexp = /^0?x([a-z\d]+)$/i;
Logger.scopeRegexp = /^(\w+|\d{1,3}|0?x[a-z\d]+):(.+)?$/i;

Logger.cleanScope = function(scope) {
	scope = "" + scope; // Ensure its a string
	var parts = scope.match(Logger.scopeRegexp);
	if(parts) {
		var col = parts[1];
		if(isNaN(parts[1])) {
			var hexParts = col.match(Logger.hexRegexp);
			if(hexParts) // Strip the 0 if one, and avoid testing names
				col = "x" + hexParts[1];
			else {
				if(col.length > 1)
					col = col.substring(0, 1).toUpperCase() + col.substring(1).toLowerCase();
				else
					col = col.toUpperCase();

				if(col in Logger.Color)
					col = Logger.Color[col];
				else
					col = Logger.Color.Magenta;
			}
		} else
			col = "x" + (col*1).toString(16);

		scope = parts[2];
		return [col, scope];
	} else
		return [Logger.Color.Magenta, scope];
}

Logger.cleanScopes = function(scopes) {
	var cleaned = [];
	scopes.forEach(function(scope) {
		cleaned.push(_.isArray(scope) ? scope : Logger.cleanScope(scope));
	});
	return cleaned;
}

// Main logging implementation
Logger.log = function(level, scopes/*:string[]*/, messages/*:any[]*/) {
	Logger.log0(level, Logger.cleanScopes(scopes), messages);
}

Logger.log0 = function(level, scopes, messages) {
	var impl = this._init();
	
	return (Logger.log0 = function(level, scopes, messages) {
		if(Logger._out instanceof Function)
			return impl.log(level, scopes, messages, Logger._out(level));
		else // Assume its a stream if its not a function
			return impl.log(level, scopes, messages, Logger._out);
	})(level, scopes, messages);
};

Logger.setStreamProvider = function(out) {
	Logger._out = out;
}

// TODO: Add custom levels from implementations
for(var key in Logger.Level) {
	if(isNaN(key))
		(function(level) {
			// Add static methods for this level
			var staticLevelFunc;
			if(process.env.NEVER_EVAL)
				staticLevelFunc = function() {
					Logger.log0(level, [], Array.prototype.slice.call(arguments, 0));
				};
			else
				staticLevelFunc = eval("(function Logger" + key + "Static() {Logger.log0(" + level + ", [], Array.prototype.slice.call(arguments, 0));})");
			Logger[key.toLowerCase()] = staticLevelFunc;
			Logger[key] = staticLevelFunc;

			// Add instance methods for this level
			var instanceLevelFunc;
			if(process.env.NEVER_EVAL)
				instanceLevelFunc = function() {
					Logger.log0(level, this._scopes, Array.prototype.slice.call(arguments, 0));
				};
			else
				instanceLevelFunc = eval("(function Logger" + key + "() {Logger.log0(" + level + ", this._scopes, Array.prototype.slice.call(arguments, 0));})");
			Logger.prototype[key.toLowerCase()] = instanceLevelFunc;
			Logger.prototype[key] = instanceLevelFunc;
		})(Logger.Level[key]);
}

module.exports = Logger;