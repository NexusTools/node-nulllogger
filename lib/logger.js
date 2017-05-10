"use strict";
const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const def_1 = require("./def");
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
module.exports = (_a = class NullLogger {
        constructor(...scopes) {
            if (!(this instanceof NullLogger)) {
                var instance = new NullLogger();
                instance._scopes = scopes;
                return instance;
            }
            this._scopes = scopes;
        }
        static setStreamFactory(factory) {
            NullLogger._streamFactory = factory;
        }
        static _init() {
            if (noLogger)
                return {
                    log() { },
                    allowAsync() {
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
                    log() {
                        var args = arguments;
                        var pending = [realImpl, args, setTimeout(function () {
                                pendingAsync.splice(pendingAsync.indexOf(pending), 1);
                                realImpl.log.apply(realImpl, args);
                            }, 0)];
                        pendingAsync.push(pending);
                    },
                    allowAsync() {
                        return false;
                    }
                };
            }
            return _impl;
        }
        static cleanScope(scope) {
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
                        if (col in def_1.Color)
                            col = def_1.Color[col];
                        else
                            col = def_1.Color.Magenta;
                    }
                }
                else
                    col = "x" + (col * 1).toString(16);
                scope = parts[2];
                return [col, scope];
            }
            else
                return [def_1.Color.Magenta, scope];
        }
        static cleanScopes(scopes) {
            var cleaned = [];
            scopes.forEach(function (scope) {
                cleaned.push(_.isArray(scope) ? scope : NullLogger.cleanScope(scope));
            });
            return cleaned;
        }
        static log(level, scopes, messages) {
            if (!NullLogger._impl)
                NullLogger._impl = NullLogger._init();
            return NullLogger._impl.log(level, NullLogger.cleanScopes(scopes), messages, NullLogger._streamFactory(level));
        }
        static gears(...messages) {
            NullLogger.log(def_1.LoggerLevel.Gears, [], messages);
        }
        static performance(...messages) {
            NullLogger.log(def_1.LoggerLevel.Performance, [], messages);
        }
        static perf(...messages) {
            NullLogger.log(def_1.LoggerLevel.Performance, [], messages);
        }
        static debugging(...messages) {
            NullLogger.log(def_1.LoggerLevel.Debugging, [], messages);
        }
        static debug(...messages) {
            NullLogger.log(def_1.LoggerLevel.Debugging, [], messages);
        }
        static info(...messages) {
            NullLogger.log(def_1.LoggerLevel.Information, [], messages);
        }
        static information(...messages) {
            NullLogger.log(def_1.LoggerLevel.Information, [], messages);
        }
        static warn(...messages) {
            NullLogger.log(def_1.LoggerLevel.Warning, [], messages);
        }
        static warning(...messages) {
            NullLogger.log(def_1.LoggerLevel.Warning, [], messages);
        }
        static error(...messages) {
            NullLogger.log(def_1.LoggerLevel.Error, [], messages);
        }
        static fatal(...messages) {
            NullLogger.log(def_1.LoggerLevel.Error, [], messages);
            process.exit(1);
        }
        gears(...messages) {
            NullLogger.log(def_1.LoggerLevel.Gears, this._scopes, messages);
        }
        timer(name, impl) {
            var logger = this.extend(name);
            NullLogger.log(def_1.LoggerLevel.Timer, logger._scopes, ["Starting..."]);
            var start = +new Date;
            impl(logger);
            NullLogger.log(def_1.LoggerLevel.Timer, logger._scopes, ["Took " + ((+new Date) - start) + "ms."]);
        }
        timerAsync(name, impl) {
            var logger = this.extend(name);
            NullLogger.log(def_1.LoggerLevel.Timer, logger._scopes, ["Starting..."]);
            var start = +new Date;
            impl(logger, function () {
                NullLogger.log(def_1.LoggerLevel.Timer, logger._scopes, ["Took " + ((+new Date) - start) + "ms."]);
            });
        }
        performance(...messages) {
            NullLogger.log(def_1.LoggerLevel.Performance, this._scopes, messages);
        }
        perf(...messages) {
            NullLogger.log(def_1.LoggerLevel.Performance, this._scopes, messages);
        }
        debugging(...messages) {
            NullLogger.log(def_1.LoggerLevel.Debugging, this._scopes, messages);
        }
        debug(...messages) {
            NullLogger.log(def_1.LoggerLevel.Debugging, this._scopes, messages);
        }
        info(...messages) {
            NullLogger.log(def_1.LoggerLevel.Information, this._scopes, messages);
        }
        information(...messages) {
            NullLogger.log(def_1.LoggerLevel.Information, this._scopes, messages);
        }
        warn(...messages) {
            NullLogger.log(def_1.LoggerLevel.Warning, this._scopes, messages);
        }
        warning(...messages) {
            NullLogger.log(def_1.LoggerLevel.Warning, this._scopes, messages);
        }
        error(...messages) {
            NullLogger.log(def_1.LoggerLevel.Error, this._scopes, messages);
        }
        fatal(...messages) {
            NullLogger.log(def_1.LoggerLevel.Fatal, this._scopes, messages);
            process.exit(1);
        }
        extend(...scopes) {
            var merged = this._scopes.slice();
            for (var i = 0; i < scopes.length; i++)
                merged.push(scopes[i]);
            var logger = new NullLogger();
            logger._scopes = merged;
            return logger;
        }
        group(name, impl) {
            impl(this.extend(name));
        }
    },
    _a.hexRegexp = /^0?x([a-z\d]+)$/i,
    _a.scopeRegexp = /^(\w+|\d{1,3}|0?x[a-z\d]+):(.+)?$/i,
    _a._streamFactory = function (level) {
        if (level >= def_1.LoggerLevel.Error)
            return process.stderr;
        else
            return process.stdout;
    },
    _a);
//# sourceMappingURL=logger.js.map