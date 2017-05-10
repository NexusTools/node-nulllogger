/// <reference path="../node_modules/@types/node/index.d.ts" />

import _ = require("lodash");
import path = require("path");
import fs = require("fs");

import { Color, LoggerLevel, INullLogger, ILoggerImpl } from "./def";

var pendingAsync: any[];
var allowAsync = "ASYNC_LOGGER" in process.env;
var noLogger = "NO_LOGGER" in process.env;

if(!noLogger && allowAsync) {
    try {
        require("death")(function() {
            pendingAsync.forEach(function(pending) {
                pending[0].log.apply(pending[0], pending[1]);
                clearTimeout(pending[2]);
            });
        });
        pendingAsync = [];
    } catch(e) {
        console.warn("'death' module is not installed, cannot provide async logging", e.stack);
        allowAsync = false;
    }
}

export = class NullLogger implements INullLogger {
    public static Color: any;
    public static Level: any;

    private static hexRegexp = /^0?x([a-z\d]+)$/i;
    private static scopeRegexp = /^(\w+|\d{1,3}|0?x[a-z\d]+):(.+)?$/i;

    private static _impl: ILoggerImpl;
    private static _streamFactory: (level: LoggerLevel) => NodeJS.WritableStream = function(level: LoggerLevel): NodeJS.WritableStream {
        if (level >= LoggerLevel.Error)
            return process.stderr;
        else
            return process.stdout;
    };

    public static setStreamFactory(factory: (level: LoggerLevel) => NodeJS.WritableStream) {
        NullLogger._streamFactory = factory;
    }

    _scopes: string[];
    constructor(...scopes: string[]) {
        if (!(this instanceof NullLogger)) {
            var instance = new NullLogger();
            instance._scopes = scopes;
            return instance;
        }

        this._scopes = scopes;
    }

    private static _init() {
        if(noLogger)
            return {
                log() {}, // NOOP
                allowAsync() {
                    return false;
                }
            };
        
        if (process.env.LOGGER_IMPL)
            return require(process.env.LOGGER_IMPL);

        var pkg = require(path.resolve(require.main.id, "package.json"));
        if (pkg.loggerImpl) {
            // TODO: Load typescript plugins
            return require(pkg.loggerImpl);
        }

        var plugins: any[] = [];
        var pluginFormat = /^(\d+)\-.+\.js$/;
        var pluginDir = path.resolve(__dirname, "impl");
        fs.readdirSync(pluginDir).forEach(function(file) {
            var matches = file.match(pluginFormat);
            if (matches)
                plugins.push([parseInt(matches[1]), file]);
        });
        plugins.sort(function(a, b) { return a[0] - b[0] });

        var $break = new Object();
        var _impl: ILoggerImpl;
        var lastErr: Error;
        try {
            plugins.forEach(function(plugin) {
                try {
                    plugin = require(path.resolve(pluginDir, plugin[1]));
                    _impl = new plugin();
                } catch (e) {
                    lastErr = e;
                    return;
                }
                throw $break;
            });
        } catch (e) {
            if (e !== $break)
                throw e;
        }
        if (!_impl)
            throw new Error("Could not create logging implementation: " + lastErr);
        if (allowAsync && _impl.allowAsync()) {
            // Wrap the real implementation in a setTimeout(0)
            var realImpl = _impl;
            _impl = {
                log() {
                    /*
                      Pass exactly as it occurs this way
                      we dont need to update this if the API changes.
                    */
                    var args = arguments;
                    var pending = [realImpl, args, setTimeout(function() {
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

    static cleanScope(scope: string): any[] {
        scope = "" + scope; // Ensure its a string
        var parts: any = scope.match(NullLogger.scopeRegexp);
        if (parts) {
            var col: any = parts[1];
            if (isNaN(parts[1])) {
                var hexParts = col.match(NullLogger.hexRegexp);
                if (hexParts) // Strip the 0 if one, and avoid testing names
                    col = "x" + hexParts[1];
                else {
                    if (col.length > 1)
                        col = col.substring(0, 1).toUpperCase() + col.substring(1).toLowerCase();
                    else
                        col = col.toUpperCase();

                    if (col in Color)
                        col = Color[col];
                    else
                        col = Color.Magenta;
                }
            } else
                col = "x" + (col * 1).toString(16);

            scope = parts[2];
            return [col, scope];
        } else
            return [Color.Magenta, scope];
    }

    static cleanScopes(scopes: string[]): any[][] {
        var cleaned: any[][] = [];
        scopes.forEach(function(scope) {
            cleaned.push(_.isArray(scope) ? scope : NullLogger.cleanScope(scope));
        });
        return cleaned;
    }

    static log(level: LoggerLevel, scopes: string[], messages: any[]) {
        if (!NullLogger._impl)
            NullLogger._impl = NullLogger._init();

        return NullLogger._impl.log(level, NullLogger.cleanScopes(scopes), messages, NullLogger._streamFactory(level));
    }

    static gears(...messages: any[]) {
        NullLogger.log(LoggerLevel.Gears, [], messages);
    }

    static performance(...messages: any[]) {
        NullLogger.log(LoggerLevel.Performance, [], messages);
    }

    static perf(...messages: any[]) {
        NullLogger.log(LoggerLevel.Performance, [], messages);
    }

    static debugging(...messages: any[]) {
        NullLogger.log(LoggerLevel.Debugging, [], messages);
    }

    static debug(...messages: any[]) {
        NullLogger.log(LoggerLevel.Debugging, [], messages);
    }

    static info(...messages: any[]) {
        NullLogger.log(LoggerLevel.Information, [], messages);
    }

    static information(...messages: any[]) {
        NullLogger.log(LoggerLevel.Information, [], messages);
    }

    static warn(...messages: any[]) {
        NullLogger.log(LoggerLevel.Warning, [], messages);
    }

    static warning(...messages: any[]) {
        NullLogger.log(LoggerLevel.Warning, [], messages);
    }

    static error(...messages: any[]) {
        NullLogger.log(LoggerLevel.Error, [], messages);
    }

    static fatal(...messages: any[]) {
        NullLogger.log(LoggerLevel.Error, [], messages);
        process.exit(1);
    }

    gears(...messages: any[]) {
        NullLogger.log(LoggerLevel.Gears, this._scopes, messages);
    }

    timer(name: string, impl: (logger: INullLogger) => void) {
        var logger = this.extend(name);
        NullLogger.log(LoggerLevel.Timer, logger._scopes, ["Starting..."]);
        var start = +new Date;
        impl(logger);
        NullLogger.log(LoggerLevel.Timer, logger._scopes, ["Took " + ((+new Date) - start) + "ms."]);
    }

    timerAsync(name: string, impl: (logger: INullLogger, cb: Function) => void) {
        var logger = this.extend(name);
        NullLogger.log(LoggerLevel.Timer, logger._scopes, ["Starting..."]);
        var start = +new Date;
        impl(logger, function() {
            NullLogger.log(LoggerLevel.Timer, logger._scopes, ["Took " + ((+new Date) - start) + "ms."]);
        });
    }

    performance(...messages: any[]) {
        NullLogger.log(LoggerLevel.Performance, this._scopes, messages);
    }

    perf(...messages: any[]) {
        NullLogger.log(LoggerLevel.Performance, this._scopes, messages);
    }

    debugging(...messages: any[]) {
        NullLogger.log(LoggerLevel.Debugging, this._scopes, messages);
    }

    debug(...messages: any[]) {
        NullLogger.log(LoggerLevel.Debugging, this._scopes, messages);
    }

    info(...messages: any[]) {
        NullLogger.log(LoggerLevel.Information, this._scopes, messages);
    }

    information(...messages: any[]) {
        NullLogger.log(LoggerLevel.Information, this._scopes, messages);
    }

    warn(...messages: any[]) {
        NullLogger.log(LoggerLevel.Warning, this._scopes, messages);
    }

    warning(...messages: any[]) {
        NullLogger.log(LoggerLevel.Warning, this._scopes, messages);
    }

    error(...messages: any[]) {
        NullLogger.log(LoggerLevel.Error, this._scopes, messages);
    }

    fatal(...messages: any[]) {
        NullLogger.log(LoggerLevel.Fatal, this._scopes, messages);
        process.exit(1);
    }

    extend(...scopes: string[]): INullLogger {
        var merged = this._scopes.slice();
        for (var i = 0; i < scopes.length; i++)
            merged.push(scopes[i]);

        var logger = new NullLogger();
        logger._scopes = merged;
        return logger;
    }

    group(name: string, impl: (logger: INullLogger) => void) {
        impl(this.extend(name));
    }

}