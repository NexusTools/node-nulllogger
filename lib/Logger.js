"use strict";
var _ = require("lodash");
var path = require("path");
var fs = require("fs");
var Def_1 = require("./Def");
var pendingAsync;
var allowAsync = "ASYNC_LOGGER" in process.env;
var noLogger = "NO_LOGGER" in process.env;
if (!noLogger && allowAsync) {
    try {
        require("death")(function () {
            pendingAsync.forEach(function (pending) {
                pending[0].log.apply(pending[0], pending[1]);
                clearTimeout(pending[2]);
            });
        });
        pendingAsync = [];
    }
    catch (e) {
        console.warn("'death' module is not installed, cannot provide async logging", e.stack);
        allowAsync = false;
    }
}
var _a;
module.exports = (_a = (function () {
        function NullLogger() {
            var scopes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                scopes[_i - 0] = arguments[_i];
            }
            if (!(this instanceof NullLogger)) {
                var instance = new NullLogger();
                instance._scopes = scopes;
                return instance;
            }
            this._scopes = scopes;
        }
        NullLogger.setStreamFactory = function (factory) {
            NullLogger._streamFactory = factory;
        };
        NullLogger._init = function () {
            if (noLogger)
                return {
                    log: function () { },
                    allowAsync: function () {
                        return false;
                    }
                };
            if (process.env.LOGGER_IMPL)
                return require(process.env.LOGGER_IMPL);
            var pkg = require(path.resolve(require.main.id, "package.json"));
            if (pkg.loggerImpl) {
                return require(pkg.loggerImpl);
            }
            var plugins = [];
            var pluginFormat = /^(\d+)\-.+\.js$/;
            var pluginDir = path.resolve(__dirname, "impl");
            fs.readdirSync(pluginDir).forEach(function (file) {
                var matches = file.match(pluginFormat);
                if (matches)
                    plugins.push([parseInt(matches[1]), file]);
            });
            plugins.sort(function (a, b) { return a[0] - b[0]; });
            var $break = new Object();
            var _impl;
            var lastErr;
            try {
                plugins.forEach(function (plugin) {
                    try {
                        plugin = require(path.resolve(pluginDir, plugin[1]));
                        _impl = new plugin();
                    }
                    catch (e) {
                        lastErr = e;
                        return;
                    }
                    throw $break;
                });
            }
            catch (e) {
                if (e !== $break)
                    throw e;
            }
            if (!_impl)
                throw new Error("Could not create logging implementation: " + lastErr);
            if (allowAsync && _impl.allowAsync()) {
                var realImpl = _impl;
                _impl = {
                    log: function () {
                        var args = arguments;
                        var pending = [realImpl, args, setTimeout(function () {
                                pendingAsync.splice(pendingAsync.indexOf(pending), 1);
                                realImpl.log.apply(realImpl, args);
                            }, 0)];
                        pendingAsync.push(pending);
                    },
                    allowAsync: function () {
                        return false;
                    }
                };
            }
            return _impl;
        };
        NullLogger.cleanScope = function (scope) {
            scope = "" + scope;
            var parts = scope.match(NullLogger.scopeRegexp);
            if (parts) {
                var col = parts[1];
                if (isNaN(parts[1])) {
                    var hexParts = col.match(NullLogger.hexRegexp);
                    if (hexParts)
                        col = "x" + hexParts[1];
                    else {
                        if (col.length > 1)
                            col = col.substring(0, 1).toUpperCase() + col.substring(1).toLowerCase();
                        else
                            col = col.toUpperCase();
                        if (col in Def_1.Color)
                            col = Def_1.Color[col];
                        else
                            col = Def_1.Color.Magenta;
                    }
                }
                else
                    col = "x" + (col * 1).toString(16);
                scope = parts[2];
                return [col, scope];
            }
            else
                return [Def_1.Color.Magenta, scope];
        };
        NullLogger.cleanScopes = function (scopes) {
            var cleaned = [];
            scopes.forEach(function (scope) {
                cleaned.push(_.isArray(scope) ? scope : NullLogger.cleanScope(scope));
            });
            return cleaned;
        };
        NullLogger.log = function (level, scopes, messages) {
            if (!NullLogger._impl)
                NullLogger._impl = NullLogger._init();
            return NullLogger._impl.log(level, NullLogger.cleanScopes(scopes), messages, NullLogger._streamFactory(level));
        };
        NullLogger.gears = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Gears, [], messages);
        };
        NullLogger.performance = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Performance, [], messages);
        };
        NullLogger.perf = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Performance, [], messages);
        };
        NullLogger.debugging = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Debugging, [], messages);
        };
        NullLogger.debug = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Debugging, [], messages);
        };
        NullLogger.info = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Information, [], messages);
        };
        NullLogger.information = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Information, [], messages);
        };
        NullLogger.warn = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Warning, [], messages);
        };
        NullLogger.warning = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Warning, [], messages);
        };
        NullLogger.error = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Error, [], messages);
        };
        NullLogger.fatal = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Error, [], messages);
            process.exit(1);
        };
        NullLogger.prototype.gears = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Gears, this._scopes, messages);
        };
        NullLogger.prototype.timer = function (name, impl) {
            var logger = this.extend(name);
            NullLogger.log(Def_1.LoggerLevel.Timer, logger._scopes, ["Starting..."]);
            var start = +new Date;
            impl(logger);
            NullLogger.log(Def_1.LoggerLevel.Timer, logger._scopes, ["Took " + ((+new Date) - start) + "ms."]);
        };
        NullLogger.prototype.timerAsync = function (name, impl) {
            var logger = this.extend(name);
            NullLogger.log(Def_1.LoggerLevel.Timer, logger._scopes, ["Starting..."]);
            var start = +new Date;
            impl(logger, function () {
                NullLogger.log(Def_1.LoggerLevel.Timer, logger._scopes, ["Took " + ((+new Date) - start) + "ms."]);
            });
        };
        NullLogger.prototype.performance = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Performance, this._scopes, messages);
        };
        NullLogger.prototype.perf = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Performance, this._scopes, messages);
        };
        NullLogger.prototype.debugging = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Debugging, this._scopes, messages);
        };
        NullLogger.prototype.debug = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Debugging, this._scopes, messages);
        };
        NullLogger.prototype.info = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Information, this._scopes, messages);
        };
        NullLogger.prototype.information = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Information, this._scopes, messages);
        };
        NullLogger.prototype.warn = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Warning, this._scopes, messages);
        };
        NullLogger.prototype.warning = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Warning, this._scopes, messages);
        };
        NullLogger.prototype.error = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Error, this._scopes, messages);
        };
        NullLogger.prototype.fatal = function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            NullLogger.log(Def_1.LoggerLevel.Fatal, this._scopes, messages);
            process.exit(1);
        };
        NullLogger.prototype.extend = function () {
            var scopes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                scopes[_i - 0] = arguments[_i];
            }
            var merged = this._scopes.slice();
            for (var i = 0; i < scopes.length; i++)
                merged.push(scopes[i]);
            var logger = new NullLogger();
            logger._scopes = merged;
            return logger;
        };
        NullLogger.prototype.group = function (name, impl) {
            impl(this.extend(name));
        };
        return NullLogger;
    }()),
    _a.hexRegexp = /^0?x([a-z\d]+)$/i,
    _a.scopeRegexp = /^(\w+|\d{1,3}|0?x[a-z\d]+):(.+)?$/i,
    _a._streamFactory = function (level) {
        if (level >= Def_1.LoggerLevel.Error)
            return process.stderr;
        else
            return process.stdout;
    },
    _a);
//# sourceMappingURL=Logger.js.map